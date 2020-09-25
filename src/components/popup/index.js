import { MetaComponent, Div } from '@rebelstack-io/metaflux';
import '../popup-settings';
import DrawCardPopup from '../drawCardPopup';

class Popup extends MetaComponent {
	constructor () {
		super(global.storage);
	}

	render () {
		const cahCard = Div().HTMLElementCreator("cah-card", {});

		this.content = cahCard.Div();

		return cahCard.baseNode();
	}

	handleStoreEvents () {
		return {
			'OPEN_MODAL_SETTINGS': _ => {
				this.content.innerHTML = "<popup-settings></popup-settings>";
				this.classList.toggle("hidden");
			},
			'OPEN_CARD_POPUP': _ => {
				this.content.innerHTML = "";
				this.content.appendChild( DrawCardPopup() );
				this.classList.toggle("hidden");
			},
			'CLOSE_POPUP': _ => {
				this.classList.toggle("hidden");
			}
		}
	}
}

window.customElements.define('cah-popup', Popup);
