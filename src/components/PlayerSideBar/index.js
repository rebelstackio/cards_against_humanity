import { Div, Span, H3, Img, Button} from '@rebelstack-io/metaflux';
import hostApi from '../../lib/backend/firebase/host';

const _storage = global.storage;
const UPDATE_EV = 'MATCH_UPDATE';
/**
 * Sidebar to display connected players
 */
const PlayerSideBar = () => Div({
	className: 'sidebar'
}, [
	H3({}, 'The People'),
	..._getThePeople()
])
.onStoreEvent(UPDATE_EV, (state, that) => {
	that.innerHTML = '';
	that.append(
		H3({}, 'The People'),
		..._getThePeople(),
		_getButton()
	);
});

function _getButton() {
	const { isHost, nplayers, size } = _storage.getState().Match;
	return isHost
	? Button({
		className: 'btn black',
		style: `grid-area: ${size + 2}/ 1;`,
		onclick: () => {
			const { id } = _storage.getState().Match;
			hostApi.startMatch(id);
		}},
	`Start with ${nplayers}/${size} players`)
	: Div();
}
/**
 * get the match players and listed
 */
function _getThePeople() {
	const match = _storage.getState().Match;
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
