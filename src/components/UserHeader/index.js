import { Div, H3, Img, Button, Span, Input } from '@rebelstack-io/metaflux';
import { singInWithGoogle } from '../../lib/backend/firebase/auth/';

const UserHeader = (isFind = false) => (
	Div({ className: 'user-header' }, _getHeaderByState(isFind))
	.onStoreEvent('AUTH_CHANGE', (state, that) => {
		that.innerHTML = '';
		that.append(..._getHeaderByState(isFind))
	})
);

const _opts = _getUserOpt();

const _search = Div({ className: 'search-area' }, [
	Input({ placeholder: 'Find Game', onkeyup: function () {
		if (this.value.length > 3){
			global.storage.dispatch({ type: 'SEARCH_GAME', data: this.value});
		}
	}}),
	Button({ onclick: _hostGame }, 'Host game')
]);

function _hostGame() {
	global.router.go('/lobby/host/');
}

function _getHeaderByState(isFind) {
	const { user } = global.storage.getState().Main;
	return [
		isFind ? _search : Span(),
		Div({className: 'auth'}, [
			H3({},user.uid ? user.displayName : 'Sing In'),
			_opts,
			user.uid
			? Img({src: user.photoURL, onclick: () => { _toggle() }})
			: Div({class: 'socials'}, [
					Button({ onclick: () => {
						singInWithGoogle();
					}},Span({className: 'fab fa-google'})),
					Button({ onclick: () => {
						singInWithGoogle();
					}}, Span({className: 'fab fa-facebook-f'}))
			])
		])
	]
}

function _getUserOpt() {
	return Div({ className: 'user-opts hidden' }, [
		Div({ onclick: () => { global.storage.dispatch({type: 'LOGOUT'}); _toggle(); } },
			[Span({},'Logout'), Span({className: 'fas fa-sign-out-alt'})])
	])
}

function _toggle() {
	_opts.classList.toggle('hidden');
}


export { UserHeader }
