/* src/lib/backend/firebase/room/index.js */

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

	return db.collection(COLLECTION).doc().set(props);
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

export default {
	STATUS,
	createRoom,
	deleteRoom,
	listRooms
};
