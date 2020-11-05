import { Div, H3, Label, Input, Button, Select, Option} from '@rebelstack-io/metaflux';
import RoomApi from '../../lib/backend/firebase/room';
import Actions from '../../handlers/actions';
import HostApi from "../../lib/backend/firebase/host/index";
import { getDeck } from '../../util';

const _storage = global.storage;
const _name = Input({name: 'name', placeholder: 'ej: Stupid Name'});
const _win = Select({name: 'wining', value: 10}, [
	Option({value: 10}, '10'),
	Option({value: 10}, '50'),
	Option({value: 10}, '100')
]);
const _deck = Select({name: 'deck', value: 'Base'}, [
	Option({value: 'Base'}, 'Base')
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
		_Actions,
	])
);

function _findGame() {
	global.router.go('/lobby/find_game/');
}

async function createNew() {
	const { displayName, uid, photoURL } = _storage.getState().Main.user;
	const fullDeck = await getDeck(_deck.value);
	const data = {
		id: uid,
		name: _name.value,
		winningScore: _win.value,
		password: _pass.value,
		createdBy: { displayName, uid },
		deck: _deck.value,
		nplayers: 1,
		players: {
			[uid]: { displayName, photoURL, score: 0, status: 'C', hand: ''},
		},
		pool: HostApi.getFullPool(fullDeck)
	};
	if(!uid) {
		Actions.displayNotification({ msg: 'Need To login to create a game' });
		return;
	}
	if (data.name !== '') {
		Actions.loadingOn({msg: `Creating room ${data.name} please wait`})
		RoomApi.createRoom(data).then((docRef) => {
			console.log('created room', docRef);
			Actions.roomCreated({ data });
			localStorage.setItem('m_joined', uid);
			Actions.loadingOff();
		}).catch((err) => {
			console.error('error', err);
		});
	} else {
		//TODO: Display mandatory values message
	}
}

export { CreationMenu }
