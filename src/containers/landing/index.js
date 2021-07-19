import { Div, Button } from '@rebelstack-io/metaflux';

const Landing = () => Div({
	className: 'main-lobby landing'
}, [
	Div({}, [
		Div({ className: 'banner' }),
		Button({className: 'btn-primary', onclick: _goTofind }, 'Find Game')
	]),
	Div({ className: 'bg-effects' })
]);

/**
 * Go to find game view
 */
function _goTofind() {
	global.router.go('/lobby/find_game/');
}

export {
	Landing
}
