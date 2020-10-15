import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../css/index.scss';
import '../handlers';
import { Div } from '@rebelstack-io/metaflux';
import { TableTop } from '../containers/table-top';
import { Lobby } from '../containers/lobby';
import { Tests } from '../containers/tests';
import { Host } from '../containers/host-game';
import { WaitingRoom } from '../containers/wating-room';
import Router from  '../router';
import '../../src/lib/backend/firebase';
import { signOut, onAuthStateChanged } from '../../src/lib/backend/firebase/auth';


global.router = new Router();
if ( location.hash === '' ) global.router.go( '/lobby/host/' );

document.addEventListener('DOMContentLoaded', () => {
	global.router.on(/lobby\/host/, () => {
		_setContent( Div({ id: 'container' }, Host()) )
	}).on(/lobby\/find/, () => {
		_setContent( Lobby() )
	}).on(/game/, () => {
		_setContent( TableTop() )
	}).on(/tests/, () => {
		_setContent(Div({ id: 'tests' }, Tests()))
	})
	.on(/waiting_room/, () => {
		_setContent( WaitingRoom() )
	})

});
/**
 * Clean the body and append content
 * @param {HTMLElement} Content HTMLElement to append
 */
function _setContent(Content) {
	document.body.innerHTML = '';
	document.body.appendChild(Content);
}

global.storage.on('LOGOUT', () => {
	signOut().then(() => {
		console.log('logout');
	}).catch((error) => {
		//TODO: Handle Errors here.
		console.error('Logout', error);
	});
});

onAuthStateChanged( (user) => {
	let _user = {};
	if(user) {
		const { displayName, email, uid, photoURL } = user;
		_user = { displayName, email, uid, photoURL }
		// TODO: DB.getRooms();
	}
	global.storage.dispatch({ type: 'AUTH_CHANGE', user: _user });
});


