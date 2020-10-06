import { MetaComponent, Div } from '@rebelstack-io/metaflux';
import DeckApi from '../../lib/backend/firebase/deck';
import RoomApi from '../../lib/backend/firebase/room';

class TestSuit extends MetaComponent {
	constructor() {
		super(global.storage);
	}

	render() {
		const props = {
			name: 'testroom3',
			size: 5,
			deck: 1,
			createdBy: 2,
			nplayers: 2
		};
		// RoomApi.deleteRoom('Q3zb9DXBoCQkQfqW2VwU').then(() => {
		// 	console.log('deleted room');
		// }).catch((err) => {
		// 	console.error('error', err);
		// });

		// RoomApi.createRoom(props).then((docRef) => {
		// 	console.log('created room', docRef);
		// }).catch((err) => {
		// 	console.error('error', err);
		// });

		// RoomApi.listRooms().then((documentSnapshots) => {
		// 	// console.log('list room', documentSnapshots.docs);
		// 	documentSnapshots.docs.forEach(d => {
		// 		console.log('room:', d.id, d.data())
		// 	});
		// }).catch((err) => {
		// 	console.error('error', err);
		// });

		// DeckApi.getDecks().then((snapshot) => {
		// 	snapshot.forEach(function(doc) {
		// 		console.log(doc.id, " => ", doc.data());
		// 	});
		// }).catch((err) => {
		// 	console.error('error', err);
		// });


		return Div();
	}

	handleStoreEvents() {
		return {
			'GET_DECKS_TEST': (action) => {
			}
		}
	}
}

window.customElements.define('test-suit', TestSuit);

