const COLLECTION = 'rooms';

const setHand = function _setPlayers(id, players, pool, db = firebase.firestore()) {
	Object.keys(players).forEach(_k => {
		let pl = players[_k];
		let hand = pl.hand;
		console.log(hand);
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
function _getLastFromPool(pool) {
	return pool.whiteCards.pl
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


export default {
	getFullPool,
	setHand
}
