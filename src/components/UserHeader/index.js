import { Div, H3, Img, Button, Span, Input } from '@rebelstack-io/metaflux';
import { singInWithGoogle, singInWithFacebook } from '../../lib/backend/firebase/auth/';

const _opts = _getUserOpt();
/**
 * Header component
 * @param {Boolean} isFind
 */
const UserHeader = (isFind = false) => (
	Div({ className: 'user-header' }, _getHeaderByState(isFind))
	.onStoreEvent('AUTH_CHANGE', (state, that) => {
		that.innerHTML = '';
		that.append(..._getHeaderByState(isFind))
	})
);
/**
 * Search input, will be disabled if not auth
 */
const _searInput = Input({ placeholder: 'Find Game', disabled:true, onkeyup: function () {
	if (this.value.length > 3) {
		global.storage.dispatch({ type: 'SEARCH_GAME', data: this.value});
	}
	if (this.value === '') _clearSearch()
}}).onStoreEvent('AUTH_CHANGE', (state, that) => {
	const { isAuth } = state.Main;
	if(isAuth) that.disabled = false;
})
/**
 * Search Box
 */
const _search = Div({ className: 'search-area' }, [
	Div({}, [
		_searInput,
		Div({ onclick:() => { _clearSearch(); _searInput.value = '';}},
			Span({className: 'fas fa-times'})
		)
	]),
	Button({ onclick: _hostGame }, 'Host game')
]);
/**
 * Clean the search value
 */
function _clearSearch() {
	global.storage.dispatch({ type: 'CLEAR_SEARCH' })
}

/**
 * handle route
 */
function _hostGame() {
	global.router.go('/lobby/host/');
}
/**
 * Display social loging or user loged
 * @param {Boolean} isFind display search input for room find
 */
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
						singInWithFacebook();
					}}, Span({className: 'fab fa-facebook-f'}))
			])
		])
	]
}
/**
 * Get the auth option to logout
 */
function _getUserOpt() {
	return Div({ className: 'user-opts hidden' }, [
		Div({ onclick: () => { global.storage.dispatch({type: 'LOGOUT'}); _toggle(); } },
			[Span({},'Logout'), Span({className: 'fas fa-sign-out-alt'})])
	])
}
/**
 * toggle hidden class
 */
function _toggle() {
	_opts.classList.toggle('hidden');
}


export { UserHeader }
