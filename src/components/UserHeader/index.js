import { Div, H3, Img, Button, Span } from '@rebelstack-io/metaflux';
import { singInWithGoogle } from '../../lib/backend/firebase/auth/';

const UserHeader = () => (
	Div({ className: 'user-header' }, _getHeaderByState())
	.onStoreEvent('AUTH_CHANGE', (state, that) => {
		that.innerHTML = '';
		that.append(..._getHeaderByState())
	})
);

const _opts = _getUserOpt();

function _getHeaderByState() {
	const { user } = global.storage.getState().Main;
	return [
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
