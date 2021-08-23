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
				className: `user-icon`, id: `trn-${pl.id}`
			},
				Div({ className: `avatar s-${pl.status}`, style: `background-image: url(${pl.photoURL});` })
			)
		} else {
			return ''
		}
	});
}

export { TurnStatus };
