/* src/controllers/index.js */

import { DBController } from './db';
import { getBackend } from '../lib/backend/';


const backend = getBackend();

// TODO: set up analytics
// firebase.analytics();

const _store = global.storage;


const singInWithGoogle = backend.auth.singInWithGoogle;

backend.auth.onAuthStateChanged( (user) => {
	let _user = {};
	if(user) {
		const { displayName, email, uid, photoURL } = user;
		_user = { displayName, email, uid, photoURL }
		// TODO: DB.getRooms();
	}
	_store.dispatch({ type: 'AUTH_CHANGE', user: _user });
});

_store.on('LOGOUT', () => {
	backend.auth.signOut().catch((error) => {
		//TODO: Handle Errors here.
	});
});

/*----------------------------------MESSAGIN----------------------------------------------*/
_store.on('SEND_MESSAGE', ( action ) => {
	const { uid } = _store.getState().Main.user;
	backend.messaging.sendMessage({ uid, message: action.msg })
});
/**
 * Subscribe to the chat in waiting room
 */
_store.on('LISTEN_CHAT', () => {
	const { id } = _store.getState().Main.match;
	backend.messaging.joinChat(id)
	.then(() => {
		console.log('Joined')
		backend.messaging.onMessage(_onMessage)
	})
	.catch(() => {
		// TODO: handle erros
	})
});
/**
 * Unsubscribe to the chat in waiting room
 */
_store.on('UNLISTEN_CHAT', () => {
	backend.messaging.offMessage();
})

function _onMessage (payload) {
	_store.dispatch({ type: 'MESSAGE_ARRIVE', payload })
}
/**--------------------------------------------------------------------------------- */
export { singInWithGoogle }
