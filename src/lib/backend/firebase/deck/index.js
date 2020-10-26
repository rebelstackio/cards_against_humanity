/* src/lib/backend/firebase/deck/index.js */
const COLLECTION = 'decks';
/**
 * Return all the decks with all the details
 * @param {object} db Firestore reference
 */
const getDecks = function _getDecks( db = firebase.firestore() ) {
	return db.collection(COLLECTION).get();
};
/**
 * Return a deck by id
 * @param {Sting} id deck id
 * @param {Object} db Firestore reference
 */
const getDeck = function _getDeck( id, db = firebase.firestore() ) {
	return db.collection(COLLECTION).doc(id).get();
}

export default {
	getDecks,
	getDeck
};

