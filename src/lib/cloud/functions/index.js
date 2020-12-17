const functions = require('firebase-functions');
let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://cardsagainsthumanity-fcd9e.firebaseio.com"
});
let _DB = admin.firestore();

/**
 * submit turn
 * @param {Object} { id: 'room_id', isCzar: boolea, submits: [], winnerID: 'czar_only' }
 */
exports.submitTurn = functions.https.onCall(async (data, context) => {
	const { id, isCzar, submits, winnerId } = data;
	const ref = _DB.collection('rooms').doc(id);
	const doc = await ref.get();
	const user = _getUserFromContext(context);
	if (doc.exists) {
		let _data = doc.data();
		_data.players[user.uid].status = 'R';// set Ready
		let hand = _data.players[user.uid].hand
		for (let i=0; i < submits.length; i++) {
			hand = hand.replace(new RegExp(`(,${submits[i]},)-|(${submits[i]},)|(,${submits[i]}$)`,'g'), '');
		}
		const lastRound = _data.rounds[Object.keys(_data.rounds).pop()];
		if(!isCzar) {
			lastRound.whiteCards[user.uid] = submits;
		} else {
			_data.players[winnerId].score++;
			lastRound.winner = { [winnerId]: submits }
		}
		_data.players[user.uid].hand = hand;
		await ref.set(_data)
		return { success: 'Submited turn' }
	} else {
		return { error: 'Unexpected Error, in match id: ' + id }
	}
});
/**
 * Join Game Enpoint
 * @param {Object} data { id: 'room_id', password: 'non-mandatory' }
 * @returns {Object}
 */
exports.joinGame = functions.https.onCall(async (data, context) => {
	const { id, password } = data;
	const ref = _DB.collection('rooms').doc(id);
	const doc = await ref.get();
	if (!context) return { error: 'Need to be loged in' }
	const user = _getUserFromContext(context)
	if(doc.exists) {
		let _data = doc.data();
		let wc = _data.pool.whiteCards.split(',');
		let hand = wc.splice(Math.max(wc.length - 10, 0));
		hand = hand.join();
		wc = wc.join();
		_data.pool.whiteCards = hand + ',' + wc;
		const newPlayers = _addPlayer(_data.players, user);
		_data.nplayers = _data.nplayers + 1;
		_data.players = newPlayers;
		_data.players[user.uid].hand = hand;
		await ref.set(_data)
		return { success: 'Joined to the game'}
	} else {
		return { error: 'No room with that id: ' + id }
	}
});

exports.sendMessage = functions.https.onCall(async (data, context) => {
	const { id, msg } = data;
	const ref = _DB.collection('rooms').doc(id);
	const doc = await ref.get();
	if (!context) return { error: 'Need to be loged in' }
	const user = _getUserFromContext(context)
	if(doc.exists) {
		let _data = doc.data();
		if (_data.messaging) {
			_data.messaging[new Date().getTime()] = { msg, uid: user.uid }
		}
		await ref.set(_data)
		return { success: 'Message posted'}
	} else {
		return { error: 'No room with that id: ' + id }
	}
})

/**
 * Leave match API
 * @param {Object} data { id: 'room-id' }
 */
exports.leaveMatch = functions.https.onCall(async (data, context) => {
	const { id } = data;
	const ref = _DB.collection('rooms').doc(id);
	const doc = await ref.get();
	if (!context) return { error: 'Need to be loged in' }
	const user = _getUserFromContext(context)
	if (doc.exists) {
		let _data = doc.data();
		_data.players[user.uid].status = 'D';
		_data.nplayers = _data.nplayers - 1;
		await ref.set(_data)
		return { success: 'leave room' }
	} else {
		return { error: 'no match with the id: ' + id }
	}
})
/**
 * shuffle once you white cards hand
 */
exports.shuffleHand = functions.https.onCall(async (data, context) => {
	const { id } = data;
	const ref = _DB.collection('rooms').doc(id);
	const doc = await ref.get();
	const user = _getUserFromContext(context)
	let _data = doc.data();
	// set allow shuffle to false
	_data.players[user.uid].isAllowShuffle = 0;
	let wc = _data.pool.whiteCards.split(',');
	// get last ten cards from the pool
	let hand = wc.splice(Math.max(wc.length - 10, 0));
	// format into string
	hand = hand.join();
	wc = wc.join();
	// re append the cards to the end of the maze
	_data.pool.whiteCards = hand + ',' + wc;
	_data.players[user.uid].hand = hand;
	await ref.set(_data)
	return { success: 'cards shuffle' }
})

/**
 * get a nice object from the firebase auth context
 * @param {*} context Firebase auth context
 */
function _getUserFromContext(context) {
	return {
		displayName: context.auth.token.name || null,
		photoURL: context.auth.token.picture || null,
		uid: context.auth.uid
	}
}
/**
 * Add user to match if is new
 * @param {Object} pl players object
 * @param {Object} user user to join object
 */
function _addPlayer(pl = {}, user) {
	if (pl[user.uid] === undefined) {
		pl[user.uid] = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			score: 0,
			status: 'P',
			hand: '',
			isAllowShuffle: 1
		}
	} else {
		pl[user.uid].status = 'P';
	}
	return pl
}
