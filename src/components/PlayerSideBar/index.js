import { Div, Span, H3, Img} from '@rebelstack-io/metaflux';

const _storage = global.storage;
/**
 * Sidebar to display connected players
 */
const PlayerSideBar = () => Div({
	className: 'sidebar'
}, [
	H3({}, 'The People'),
	..._getThePeople()
]);
/**
 * get the match players and listed
 */
function _getThePeople() {
	const { match } = _storage.getState().Main;
	return Object.keys(match.players).map(_uid => {
		const pl = match.players[_uid];
		return Div({className: 'player-box'}, [
			Img({src: pl.photoURL}),
			Span({}, pl.displayName),
			match.id === _uid ? Span({className: 'fas fa-crown'}) : ''
		])
	})
}

export { PlayerSideBar };