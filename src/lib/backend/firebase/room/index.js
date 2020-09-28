/* src/lib/backend/firebase/room.js */

const ROOM_STATUS_WAITING = 'W';
// const ROOM_STATUS_RUNNING = 'R';
// const ROOM_STATUS_ENDED = 'E';

const DEFAULT_ROOM_PAYLOAD = {
	password: null,
	status: ROOM_STATUS_WAITING,
	size: 5,
	winningScore: 20,
	created: null
};

/**
 * Create a new document in rooms collections
 * @param {object} payload Room properties: { name, password, size, status, winningScore }.
 * @param {string} createdBy Owner Firebase ID
 * @param {string} deckId Deck used ID
 * @returns Promise( docRef )
 */
const createRoom = function _createRoom (payload = {}, createdBy = null, deckId = null ) {
	if (!createdBy) {
		return Promise.reject(new TypeError('Room requires createdBy property'));
	}

	if (!deckId) {
		return Promise.reject(new TypeError('Room requires deckId property'));
	}

	if (!payload.name) {
		return Promise.reject(new TypeError('Room requires name property'));
	}

	const _payload = {
		...DEFAULT_ROOM_PAYLOAD,
		...{
			createdBy,
			deckId,
			created: firebase.firestore.FieldValue.serverTimestamp()
		},
		...payload
	};
	return firebase.firestore().collection('rooms').add(_payload);
};

export default {
	createRoom
};
