import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../css/index.scss';
import '../handlers';
import { Div } from '@rebelstack-io/metaflux';
import { TableTop } from '../containers/table-top';
import { FindGame } from '../containers/find-game';
import { Tests } from '../containers/tests';
import { Host } from '../containers/host-game';
import { WaitingRoom } from '../containers/wating-room';
import { Czar } from '../containers/czar';
import Router from  '../router';
import '../../src/lib/backend/firebase';
import { signOut, onAuthStateChanged } from '../../src/lib/backend/firebase/auth';
import RoomApi from '../lib/backend/firebase/room';
import Actions from '../handlers/actions';


global.router = new Router();
if ( location.hash === '' ) global.router.go( '/lobby/host/' );

document.addEventListener('DOMContentLoaded', () => {
	global.router.on(/lobby\/host/, () => {
		_setContent( Div({ id: 'container' }, Host()) )
	}).on(/lobby\/find_game/, () => {
		_setContent( FindGame() )
	}).on(/\/game\//, () => {
		_setContent( TableTop() )
	}).on(/tests/, () => {
		_setContent(Div({ id: 'tests' }, Tests()))
	})
	.on(/waiting_room/, () => {
		_setContent( WaitingRoom() )
	})
	.on(/czar/, () => {
		_setContent( Czar() )
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
		const joined = localStorage.getItem('m_joined');
		if (joined !== null) {
			_listenRoom({ newState: { Match: { id: joined } }})
		}
	}
	global.storage.dispatch({ type: 'AUTH_CHANGE', user: _user });
});

global.storage.on('MATCH_CREATED',_listenRoom);
global.storage.on('MATCH_JOINED',_listenRoom)

function _listenRoom(action) {
	const state = action.newState;
	RoomApi.listenRoom(state.Match.id, (snap) => {
		console.log('got snapshot')
		Actions.roomUpdate({ data: snap.data() })
	})
}

