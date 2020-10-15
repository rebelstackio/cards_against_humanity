import { Div, H3, Label, Input, Button, Select, Option} from '@rebelstack-io/metaflux';

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
		_Actions
	])
);

function _findGame() {
	global.router.go('/lobby/find_game/');
}

function createNew() {
	const data = { name: _name.value, winningScore: _win.value, password: _pass.value };
	if (data.name !== '') {
		global.storage.dispatch({ type:'LOADING_ON' })
		// TODO: call API
		setTimeout(() => {
			global.storage.dispatch({ type:'LOADING_OFF' })
			global.router.go("waiting_room");
			global.storage.dispatch({ type: 'CREATE_NEW_GAME', data})
		}, 2000)
	} else {
		//TODO: Display mandatory values message
	}
}

export { CreationMenu }
