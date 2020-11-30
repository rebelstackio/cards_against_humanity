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
import { getDeck } from  '../util';
import { NextRound } from '../components/NextRound';
import { LoadignModal } from '../components/LoadingModal';
import { SnackBar } from '../components/SnackBar';
import { Summary } from '../containers/summary';
import { GameSounds } from '../audio';
import { ConfirmationPopUp } from '../components/ConfirmationPopup';
import { DebugCounter } from '../debug';

global.router = new Router();
global.gameSounds = new GameSounds();
global.debugCount = new DebugCounter();

if ( location.hash === '' ) global.router.go( '/lobby/host/' );

HTMLElement.prototype.onStoreEvent = function (event, callback, stName = false) {
	const storageName = stName ? stName : 'storage'
	if (!global[storageName]){
		throw new TypeError(`CustomElements.onStoreEvent: ${storageName} is not defined, this must be defined <global | window>.${storageName} level`);
	}
	global[storageName].on(event, () => {
		if (this.baseNode() instanceof HTMLHtmlElement) {
			callback(global[storageName].getState(), this);
		}
	});
	return this;
}

document.addEventListener('DOMContentLoaded', () => {
	global.router.on(/lobby\/host/, () => {
		_setContent( Div({ id: 'container' }, Host()) )
	}).on(/lobby\/find_game/, () => {
		_setContent( FindGame() )
	}).on(/\/game\//, () => {
		console.log('load game view')
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
	.on(/summary/, () => {
		_setContent( Summary() )
	})

});
/**
 * Clean the body and append content
 * @param {HTMLElement} Content HTMLElement to append
 */
function _setContent(Content) {
	document.body.innerHTML = '';
	document.body.append(Content, ..._getCommondComponents());
}

function _getCommondComponents() {
	return [
		NextRound(),
		LoadignModal(),
		SnackBar(),
		ConfirmationPopUp()
	]
}

global.storage.on('LOGOUT', () => {
	signOut().then(() => {
		console.log('logout');
	}).catch((error) => {
		//TODO: Handle Errors here.
		console.error('Logout', error);
	});
});
/**
 *
 */
onAuthStateChanged( (user) => {
	let _user = {};
	if(user) {
		const { displayName, email, uid, photoURL } = user;
		_user = { displayName, email, uid, photoURL }
		const joined = localStorage.getItem('m_joined');
		if (joined !== null) {
			_listenRoom({ newState: { Match: { id: joined } }})
		}
	}
	global.storage.dispatch({ type: 'AUTH_CHANGE', user: _user });
});

global.storage.on('MATCH_CREATED',_listenRoom);
global.storage.on('MATCH_JOINED',_listenRoom)
/**
 * Listen to room changes
 * @param {*} action
 */
function _listenRoom(action) {
	const state = action.newState;
	global.debugCount.count('req_to_listen')
	RoomApi.listenRoom(state.Match.id, async (snap) => {
		const data = snap.data();
		if (!data) return;
		const _deck = await getDeck(data.deck)
		Actions.roomUpdate({ data, deck:_deck });
		global.debugCount.count('dispacth_update_ev')
		const {uid} = global.storage.getState().Main.user;
		const player = data.players[uid];
		if (player.isCzar && data.status === 'R') {
			global.router.go('/czar/')
		} else {
			goByStatus(data.status);
		}
	})
}
/**
 * change dir by the match status
 * @param {String} status
 */
function goByStatus(status) {
	console.log('#> Match status: ',status);
	switch (status) {
		case 'R':
			global.router.go('/game/')
			break;
		case 'E':
			global.router.go('/summary/');
			break;
		default:
			global.router.go('/waiting_room/');
			break;
	}
}


window.addEventListener('beforeunload', () => {
	global._matchListener()
})
