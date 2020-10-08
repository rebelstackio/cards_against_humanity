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
import Router from  '../router';
import '../../src/lib/backend/firebase';
import { signOut, onAuthStateChanged } from '../../src/lib/backend/firebase/auth';


global.router = new Router();

global.router.go('/lobby/');

console.log('main', process.env);
document.addEventListener('DOMContentLoaded', () => {

	global.router.on(/lobby/, () => {
		document.body.innerHTML = '';
		document.body.appendChild(
			Div({
				id: 'container'
			}, Lobby())
		);
	}).on(/game/, () => {
		document.body.innerHTML = '';
		document.body.appendChild( TableTop() );
	}).on(/tests/, () => {
		document.body.innerHTML = '';
		document.body.appendChild(
			Div({
				id: 'tests'
			}, Tests())
		);
	});

});

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

