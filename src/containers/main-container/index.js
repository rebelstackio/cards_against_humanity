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
import '../../handlers';
import { TableTop } from '../../containers/table-top';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

class MainContainer extends MetaContainer {
	// eslint-disable-next-line class-method-use-this
	render () {
		return Div({
			id: 'container'
		}, TableTop());
	}
}

window.customElements.define('main-container', MainContainer);
