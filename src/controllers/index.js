/* src/controllers/index.js */

// import { DBController } from './db';
import { init } from '../lib/backend/firebase';

// const firebase = init();
// const backend = getBackend();

// TODO: set up analytics
// firebase.analytics();

const _store = global.storage;


const singInWithGoogle = () => {

}
// const singInWithGoogle = backend.auth.singInWithGoogle;

// backend.auth.onAuthStateChanged( (user) => {
// 	let _user = {};
// 	if(user) {
// 		const { displayName, email, uid, photoURL } = user;
// 		_user = { displayName, email, uid, photoURL }
// 		// TODO: DB.getRooms();
// 	}
// 	_store.dispatch({ type: 'AUTH_CHANGE', user: _user });
// });

// _store.on('LOGOUT', () => {
// 	backend.auth.signOut().catch((error) => {
// 		//TODO: Handle Errors here.
// 	});
// });

export { singInWithGoogle }
