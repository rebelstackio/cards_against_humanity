import { Div, Img } from '@rebelstack-io/metaflux';
import MatchData from '../../controllers/MatchDataManager';

const UPDATE_EV = 'MATCH_UPDATE';

const TurnStatus = () => Div({ className: 'turn-viewer' }, _getTurnContent())
	.onStoreEvent(UPDATE_EV, (_, that) => {
		that.innerHTML = '';
		that.append(..._getTurnContent())
	})
/**
 * Get List content
 */
function _getTurnContent() {
	const players = MatchData.getPlayers(true);
	return players.map((pl) => {
		if(!pl.isCzar && pl.status !== 'D') {
			return Div({
				className: `user-icon s-${pl.status}`, id: `trn-${pl.id}`
			}, Img( { src: pl.photoURL } ))
			/*.onStoreEvent(UPDATE_EV, (state, that) => {
				that.className = `user-icon s-${state.Match.players[pl.id].status}`
			})*/
		} else {
			return ''
		}
	});
}

export { TurnStatus };
