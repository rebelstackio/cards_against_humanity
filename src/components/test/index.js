import { MetaComponent, Div } from '@rebelstack-io/metaflux';
import { getDecks } from '../../lib/backend/firebase/deck';

class TestSuit extends MetaComponent {
	constructor() {
		super(global.storage);
	}

	render() {
		// getDecks().then((db) => {
		// 	console.log('==>', db);
		// }).catch((err) => {
		// 	console.error('error', err);
		// });
		this.store.dispatch({ type: 'GET_DECKS_TEST' });
		return Div();
	}

	handleStoreEvents() {
		this.store.on('GET_DECKS_TEST', (action) => {
			getDecks().then((db) => {
				console.log('==>', db);
			}).catch((err) => {
				console.error('error', err);
			});
		});
	}
}

window.customElements.define('test-suit', TestSuit);

