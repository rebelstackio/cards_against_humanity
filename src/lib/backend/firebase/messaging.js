/* src/lib/backend/firebase/messaging.js */
import firebase from 'firebase/compat/app';

const COLLECTION = 'waiting_room';

const sendMessage = function _sendMessage(payload, db=firebase.firestore()) {
	const { id, uid, msg } = payload;
	const ref = db.collection(COLLECTION).doc(id);
	return ref.set({
		[new Date().getTime()]: { msg, uid }
	}, { merge: true });
}
/**
 * Listen to changes in db
 * @param {CallableFunction} next callback
 */
const onMessage = function _onMessage(id, next, db = firebase.firestore()) {
	return db.collection(COLLECTION).doc(id).onSnapshot(next)
}
/**
 *
 */
const offMessage = function _offMessage() {
	// TODO: kill chat listener on game
	console.log('off chat Listener');
}

const joinChat = function _joinChat(id) {
	// TODO: join maybe cloud funct??
	console.log('Joining chat: ', id);
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(''),500)
	})
}


export default { sendMessage, onMessage, offMessage, joinChat }
