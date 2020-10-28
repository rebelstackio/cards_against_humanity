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
	pool.blackCards = pool.blackCards.split(',')
	const czarCard = pool.blackCards.pop();
	pool.blackCards.join();
	db.collection(COLLECTION).doc(id).set({
		status: 'R',
		rounds: [{ whiteCards: {}, winner: {} }],
		players,
		czarCard,
		pool
	}, { merge: true });
}

function _getCzar(players) {
	let isFirst = true;
	const keys = Object.keys(players);
	keys.forEach((_k, i) => {
		const pl = players[_k];
		players[_k].status = 'P';
		if (pl.isCzar) {
			players[_k].isCzar = false;
			isFirst = false;
			if ((i + 1) === keys.length) {
				// is the last, start over
				players[keys[0]].isCzar = true;
			} else {
				players[keys[i + 1]].isCzar = true;
			}
		}
	})
	if (isFirst) {
		players[_getRandom(keys)].isCzar = true;
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


export default {
	getFullPool,
	setHand,
	startMatch
}
