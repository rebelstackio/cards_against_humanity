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
	Div({}, [...getEmptyRows(_getThePeople())]),
	_getButton()
])
.onStoreEvent(UPDATE_EV, (state, that) => {
	that.innerHTML = '';
	console.log(_getThePeople());
	that.append(
		H3({}, 'The People'),
		Div({}, [...getEmptyRows(_getThePeople())]),
		_getButton()
	);
});

function _getButton() {
	const { isHost, nplayers, size } = _storage.getState().Match;
	return isHost
	? Button({
		className: 'btn-primary',
		onclick: () => {
			const { id, players, pool } = _storage.getState().Match;
			hostApi.startMatch(id, players, pool);
		}},
	`Start with ${nplayers}/${size} players`)
	: Span();
}
/**
 * get the match players and listed
 */
function _getThePeople() {
	const match = _storage.getState().Match;
	const { uid } = _storage.getState().Main.user;
	return Object.keys(match.players).map(_pid => {
		const pl = match.players[_pid];
		if (pl.status !== 'D') {
			return Div({className: 'player-box'}, [
				(match.id === uid && _pid !== uid)
				? Div({ className: 'delete-btn', onclick: kick })
				: Div(),
				Span({}, pl.displayName),
				Div({ className: 'score' }, [Span({}, `x${pl.score}`), Span({className: 'score-coin'})])
			])
		}
		return;
	})
}
/**
 * Fill with empty player box if there is less than 5
 */
function getEmptyRows(arr) {
	if(arr.length > 4) return arr;
	for(let i=0; i < 5; i++) {
		if (arr[i] === undefined) {
			arr[i] = Div({className: 'player-box'})
		}
	}
	return arr;
}

function kick () {
	//TODO:
}

export { PlayerSideBar };
