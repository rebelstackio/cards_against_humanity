import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../css/general.css';
import '../css/table-top.scss';
import '../css/cat-banner.scss';
import '../css/draw-card-popup.scss';
import '../css/hand.scss';
import '../css/card.scss';
import '../css/score-board.scss';
import '../css/corner-menu.scss';
import '../css/czar-indicator.scss';
import '../css/cah-popup.scss';
import '../css/lobby.scss';
import '../handlers';
import { Div } from '@rebelstack-io/metaflux';
import { TableTop } from '../containers/table-top';
import { Lobby } from '../containers/lobby'
import '../controllers';


import Router from  '../router';

window.router = new Router();

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
