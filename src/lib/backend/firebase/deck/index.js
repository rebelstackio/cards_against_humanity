/* src/lib/backend/firebase/deck/index.js */

/**
 * Return all the decks with all the details
 * @param {object} db Firestore reference
 */
const getDecks = function _getDecks( db = firebase.firestore() ) {
	return db.collections('decks').get();
};

export default {
	getDecks
};

