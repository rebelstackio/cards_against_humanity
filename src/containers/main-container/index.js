import { MetaContainer, Div } from '@rebelstack-io/metaflux';
import '../../css/general.css';
import '../../css/table-top.scss';
import '../../css/cat-banner.scss';
import '../../css/hand.scss';
import '../../css/card.scss';
import '../../css/score-board.scss';
import '../../css/corner-menu.scss';
import '../../css/czar-indicator.scss';
import '../../css/cah-popup.scss';
import '../../css/lobby.scss';
import '../../handlers';
import { TableTop } from '../../containers/table-top';
import { Lobby } from '../lobby'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

class MainContainer extends MetaContainer {
	constructor () {
		super();
		this._storage = global.storage;
		this.storeEvents = this.storeEvents.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.container =
		Div({
			id: 'container'
		}, Lobby());
		this.storeEvents();
		return this.container;
	}

	storeEvents() {
		this._storage.on('CREATE_NEW_GAME', () => {
			this.container.innerHTML = '';
			this.container.appendChild(TableTop());
		});
		this._storage.on('JOIN_GAME', () => {
			this.container.innerHTML = '';
			this.container.appendChild(TableTop());
		});
	}
}

window.customElements.define('main-container', MainContainer);
