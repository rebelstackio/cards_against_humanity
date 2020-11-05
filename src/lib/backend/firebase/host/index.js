const COLLECTION = 'rooms';
/**
 * Set the hand for every player
 * @param {String} id Room id
 * @param {Object} players Players object
 * @param {Object} pool object of available cards
 * @param {*} db firebase reference
 */
const setHand = function _setPlayers(id, players, pool, db = firebase.firestore()) {
	Object.keys(players).forEach(_k => {
		let pl = players[_k];
		let hand = pl.hand;
		hand = hand.match(/[0-9]+/g) || [];
		let wihiteCards = pool.whiteCards.split(',');
		const left = 10 - hand.length;
		for (let i = 0; i < left; i++){
			hand.push(wihiteCards.pop());
		}
		pool.whiteCards = wihiteCards.join();
		players[_k].hand = hand.join();
	});
	// write playes and pool in database
	db.collection(COLLECTION).doc(id).set({
			players,
			pool
		},
		{ merge: true } // update instead of overwrite
	);
}
/**
 * Get initial pool with all cards
 * @param {Object} deck Deck object
 */
const getFullPool = function _getPool(deck) {
	let pool = {}
	pool.whiteCards = deck.whiteCards.map((_,id) => {
		return `${id}`
	}).join();
	pool.blackCards = deck.blackCards.map((_,id) => {
		return `${id}`
	}).join()
	return _shufflePool(pool);
}
/**
 * Shuffle pool
 * @param {String} pool
 */
function _shufflePool(pool) {
	pool.whiteCards = pool.whiteCards.split(',').sort(() => {
		return Math.random() - 0.5
	}).join();
	pool.blackCards = pool.blackCards.split(',').sort(() => {
		return Math.random() - 0.5
	}).join();
	return pool;
}
/**
 * Strart the match
 * @param {String} id RoomID
 * @param {Object} players player object
 * @param {Object} pool pool object
 * @param {*} db Firestore reference
 */
const startMatch = function _startMatch(id, players, pool, db = firebase.firestore()) {
	players = _getCzar(players);
	players = _resetStatus(players);
	pool.blackCards = pool.blackCards.split(',')
	const czarCard = pool.blackCards.pop();
	pool.blackCards = pool.blackCards.join();
	db.collection(COLLECTION).doc(id).set({
		status: 'R',
		rounds: [{ whiteCards: {}, winner: {}, czarCard }],
		players,
		czarCard,
		pool
	}, { merge: true });
}
/**
 * get next czar, if there is no czar get random one
 * Due to this is call at the end of the round also reset the status for each player to picking
 * @param {Object} players
 */
function _getCzar(players) {
	let isFirst = true;
	const keys = Object.keys(players);
	for (let i in keys) {
		i = parseInt(i);
		let _k = keys[i];
		const pl = players[_k];
		if (pl.isCzar) {
			console.log('isCzar ', pl.displayName);
			players[_k].isCzar = false;
			isFirst = false;
			if ((i + 1) === keys.length) {
				// is the last, start over
				players[keys[0]].isCzar = true;
				console.log('new czar', players[keys[0]].displayName);
			} else {
				console.log('new czar', players[keys[i + 1]].displayName);
				players[keys[i + 1]].isCzar = true;
			}
			break;
		}
		i++;
	}
	if (isFirst) {
		console.log('random czar');
		players[_getRandom(keys)].isCzar = true;
	}
	return players;
}
/**
 * Reset player to Picking status
 * @param {Object} players Players object
 */
function _resetStatus(players) {
	const keys = Object.keys(players);
	for(let i=0; i < keys.length; i++) {
		players[keys[i]].status = 'P';
	}
	return players;
}
/**
 * get random player key
 * @param {Array} keys
 */
function _getRandom(keys) {
	return keys[Math.floor(Math.random() * (keys.length - 0)) + 0];
}

/**
 * Set next round
 * @param {String} id RoomID
 * @param {Array} rounds current rounds
 * @param {Object} players players Objet
 * @param {*} db Firestore reference
 */
const NextRound = function _nextRound(id, rounds, players, pool, winningScore, db = firebase.firestore()) {
	players = _getCzar(players);
	players = _resetStatus(players);
	pool.blackCards = pool.blackCards.split(',')
	const czarCard = pool.blackCards.pop();
	rounds.push({ whiteCards: {}, winner: {}, czarCard });
	pool.blackCards = pool.blackCards.join();
	db.collection(COLLECTION).doc(id).set({
		players,
		rounds,
		pool,
		czarCard,
		status: _checkEndOfMatch(players, winningScore) ? 'E' : 'R'
	}, { merge: true }) // update and not overwrite
}
/**
 * Return true if a player have the score limit
 * @param {Object} players Players object
 * @param {Number} scoreLimit limit the score can get
 */
function _checkEndOfMatch(players, scoreLimit) {
	const keys = Object.keys(players);
	for(let i=0; i < keys.length; i++) {
		const pl = players[keys[i]];
		if (pl.score >= scoreLimit) return true;
	}
	return false;
}
/**
 * start the match over
 * @param {String} id RoomID
 * @param {Object} deck Deck object
 * @param {*} db Firestore reference
 */
const startOver = async function _startOver(id, deck, db = firebase.firestore()) {
	const ref = db.collection(COLLECTION).doc(id)
	const doc = await ref.get();
	let data = doc.data();
	data.pool = getFullPool(deck);
	const keys = Object.keys(data.players);
	data.rounds = [];
	data.status = 'W';
	for (let i=0; i < keys.length; i++) {
		data.players[keys[i]].score = 0;
		data.players[keys[i]].hand = '';
	}
	return ref.set(data);
}

export default {
	getFullPool,
	setHand,
	startMatch,
	NextRound,
	startOver
}
