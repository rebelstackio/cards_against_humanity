/* src/lib/backend/firebase/messaging.js */

// TODO: Messaging

const sendMessage = function _sendMessage(payload) {
	//TODO: handle send message
	console.log('sendMessage: ', payload);
}

const onMessage = function _onMessage(next) {
	//TODO:
	const payload = { uid: 'jdksdla', message: 'Hello there' }
	setTimeout(() => { next(payload) }, 3000)
}

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
