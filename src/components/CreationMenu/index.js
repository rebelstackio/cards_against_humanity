import { Div, H3, Label, Input, Button, Select, Option} from '@rebelstack-io/metaflux';
import RoomApi from '../../lib/backend/firebase/room';

const _storage = global.storage;
const _name = Input({name: 'name', placeholder: 'ej: Stupid Name'});
const _win = Select({name: 'wining', value: 10}, [
	Option({value: 10}, '10'),
	Option({value: 10}, '50'),
	Option({value: 10}, '100')
]);
const _deck = Select({name: 'deck', value: 'Base'}, [
	Option({value: 1}, 'Base')
	//TODO: get deck from database
])
const _pass = Input({name: 'password', placeholder: 'ej: Stupid Password', type: 'password'});
const _Actions = Div({ className: 'host-actions' }, [
	Button({ onclick: createNew }, 'Let\'s Go'),
	Button({ onclick: _findGame }, 'Find Game')
]);
/**
 * Creatio menu componetn
 */
const CreationMenu = () =>(
	Div({ className: 'creation-menu' },[
		H3({}, 'Create Game'),
		Label({for: 'name'}, 'Name'),
		_name,
		Label({for: 'wining'}, 'Wining score'),
		_win,
		Label({for: 'deck'}, 'Deck'),
		_deck,
		Label({for: 'password'}, 'Password'),
		_pass,
		_Actions
	])
);

function _findGame() {
	global.router.go('/lobby/find_game/');
}

function createNew() {
	const { displayName, uid } = _storage.getState().Main.user;
	const data = {
		name: _name.value,
		winningScore: _win.value,
		password: _pass.value,
		createdBy: { displayName, uid },
		deck: _deck.value
	};
	if (data.name !== '') {
		global.storage.dispatch({ type:'LOADING_ON', msg: `Creating room ${data.name} please wait` })
		RoomApi.createRoom(data).then((docRef) => {
			console.log('created room', docRef);
			global.storage.dispatch({ type:'LOADING_OFF' })
			global.router.go(`/waiting_room/${uid}`)
		}).catch((err) => {
			console.error('error', err);
		});
	} else {
		//TODO: Display mandatory values message
	}
}

export { CreationMenu }
