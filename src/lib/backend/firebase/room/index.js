/* src/lib/backend/firebase/room/index.js */
import firebase from 'firebase/compat/app';

const COLLECTION = 'rooms';

const STATUS = {
	WAITING: 'W',
	RUNNING: 'R',
	ENDED: 'E'
};

const DEFAULT_ROOM = {
	password: null,
	size: 10,
	status: STATUS.WAITING,
	nplayers: 0
};

const DEFAULT_PAGE_SIZE = 10;

/**
 * Create a new room. Required props for a room: name, createdBy, deck
 * @param {object} roomProps Room props { name, password, size, status[W|R|E], createdBy, created, deck }
 * @param {object} db Firestore reference
 * @param {object} time firebase.firestore.Timestamp reference
 */
const createRoom = function _createRoom( roomProps, db = firebase.firestore(), time = firebase.firestore.Timestamp ) {

	let props = { ...DEFAULT_ROOM, ...{ created: time.now() }, ...roomProps };
	if ( !props.name ) {
		return  Promise.reject( new TypeError('name is required'));
	}

	if ( !props.deck ) {
		return  Promise.reject( new TypeError('deck is required'));
	}

	if ( !props.createdBy ) {
		return  Promise.reject( new TypeError('createdBy is required'));
	}

	return db.collection(COLLECTION).doc(props.createdBy.uid).set(props);
};

/**
 * Delete a room based on the id
 * @param {string} roomId string id
 * * @param {object} db Firestore reference
 */
const deleteRoom = function _deleteRoom( roomId, db = firebase.firestore() ) {

	if ( !roomId ) {
		return  Promise.reject( new TypeError('roomId is required'));
	}

	return db.collection(COLLECTION).doc(roomId).delete();
}

/**
 * Get the rooms order by room size( # players ). Supports Pagination based on firebase
 * Check https://firebase.google.com/docs/firestore/query-data/query-cursors#paginate_a_query
 * @param {number} limit Page size
 * @param {object} startAfter Last room from previous page
 * @param {object} db Firestore reference
 */
const listRooms = function _listRooms(limit = DEFAULT_PAGE_SIZE, startAfter = null, db = firebase.firestore()) {
	if ( startAfter ) {
		return db.collection(COLLECTION).orderBy('nplayers', 'desc').startAfter(startAfter).limit(limit).get();
	} else {
		return db.collection(COLLECTION).orderBy('nplayers', 'desc').limit(limit).get();
	}
}
/**
 * List Rooms startting with value string. Supports Pagination based on firebase
 * @param {String} value Search value
 * @param {number} limit Page size
 * @param {object} startAfter Last room from previous page
 * @param {object} db Firestore reference
 */
const searchRoom = function _searchRoom(value,limit = DEFAULT_PAGE_SIZE, startAfter = null, db = firebase.firestore()) {
	if ( startAfter ) {
		return db.collection(COLLECTION)
			.startAfter(startAfter)
			.where('name', '>=', value)
			.limit(limit)
			.get();
	} else {
		return db.collection(COLLECTION)
			.where('name', '>=', value)
			.where('name', '<', value + 'z') // last char*/
			.limit(limit)
			.get();
	}
}

/**
 * Handle Join Room cloud function
 * @param {String} id room id
 * @param {String} password
 * @param {CallableFunction}
 */
const joinRoom = function _joinRoom(id, password, callback) {
	const joinGame = firebase.functions().httpsCallable('joinGame');
	joinGame({ id, password })
	.then(res => {
		callback(res.data);
	})
}
/**
 * Listen to the room changes
 * @param {String} id RoomID
 * @param {CallableFunction} callback handler callback
 * @param {*} db Firestore reference
 */
const listenRoom = function _listenRoom(id, callback, db = firebase.firestore()) {
	global._matchListener = db.collection(COLLECTION).doc(id).onSnapshot(callback)
}
/**
 * Submit turn to cloud function
 * @param {String} id RoomID
 * @param {Boolean} isCzar is czar turn
 * @param {Array} submits Array of white cards
 * @param {String} winnerId Id for the winner of the round (czar only)
 * @param {*} db Firestore Reference
 */
const submitTurn = function _submitTurn(id, isCzar, submits, winnerId, db = firebase.firestore()) {
	const submitTurn = firebase.functions().httpsCallable('submitTurn');
	return submitTurn({ id, isCzar, submits, winnerId })
}
/**
 * leave room API
 * @param {String} id RoomID
 */
const leaveRoom = function _leaveRoom(id) {
	const leaveMatch = firebase.functions().httpsCallable('leaveMatch');
	return leaveMatch({ id })
}
/**
 * shuffle hand API
 */
const shuffleHand = function _shuffleHand(id) {
	const cf = firebase.functions().httpsCallable('shuffleHand');
	return cf({ id });
}

export default {
	STATUS,
	createRoom,
	deleteRoom,
	listRooms,
	searchRoom,
	joinRoom,
	listenRoom,
	submitTurn,
	leaveRoom,
	shuffleHand
};
