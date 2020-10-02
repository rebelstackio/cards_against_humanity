import { MetaComponent, Div } from '@rebelstack-io/metaflux';
import DeckApi from '../../lib/backend/firebase/deck';

class TestSuit extends MetaComponent {
	constructor() {
		super(global.storage);
	}

	render() {
		DeckApi.getDecks().then((snapshot) => {
			snapshot.forEach(function(doc) {
				console.log(doc.id, " => ", doc.data());
			});
		}).catch((err) => {
			console.error('error', err);
		});
		return Div();
	}

	handleStoreEvents() {
		return {
			'GET_DECKS_TEST': (action) => {
				console.log('===>', DeckApi.getDecks)
				DeckApi.getDecks().then((db) => {
						console.log('==>', db);
				}).catch((err) => {
						console.error('error', err);
				});
			}
		}
	}
}

window.customElements.define('test-suit', TestSuit);

