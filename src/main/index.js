import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../css/index.scss';
import '../handlers';
import { Div } from '@rebelstack-io/metaflux';
import { TableTop } from '../containers/table-top';
import { Lobby } from '../containers/lobby'
import '../controllers';


import Router from  '../router';

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
	});

})
