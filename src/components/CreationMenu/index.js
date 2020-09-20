import { Div, H3, Label, Input, Button} from '@rebelstack-io/metaflux';

const _name = Input({name: 'name', placeholder: 'ej: Stupid Name'});
const _max = Input({name: 'max', value: 10});
const _pass = Input({name: 'password', placeholder: 'ej: Stupid Password', type: 'password'});

const CreationMenu = () =>(
	Div({ className: 'creation-menu' },[
		H3({}, 'Create Game'),
		Label({for: 'name'}, 'Name'),
		_name,
		Label({for: 'max'}, 'Wining score'),
		_max,
		Label({for: 'password'}, 'Password'),
		_pass,
		Button({ onclick: createNew }, 'Let\'s Go')
	])
);

function createNew() {
	const data = { name: _name.value, max: _max.value, password: _pass.value };
	if (data.name !== '' && data.max !== '') {
		global.storage.dispatch({ type:'LOADING_ON' })
		// TODO: call API
		setTimeout(() => {
			global.storage.dispatch({ type:'LOADING_OFF' })
			global.router.go("game");
			//global.storage.dispatch({ type: 'CREATE_NEW_GAME', data})
		}, 2000)
	} else {
		//TODO: Display mandatory values message
	}
}

export { CreationMenu }
