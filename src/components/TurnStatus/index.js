import { Div, Img } from '@rebelstack-io/metaflux';

const _storage = global.storage;
const UPDATE_EV = 'MATCH_UPDATE';

const TurnStatus = () => Div({ className: 'turn-viewer' }, _getTurnContent())
	.onStoreEvent(UPDATE_EV, (_, that) => {
		that.append(..._getTurnContent())
	})

function _getTurnContent() {
	const { players } = _storage.getState().Match;
	return Object.keys(players).map((key) => {
		const pl = players[key];
		if(!pl.isCzar) {
			return Div({
				className: `user-icon s-${pl.status}`, id: `trn-${key}`
			}, Img( { src: pl.photoURL } ))
			.onStoreEvent(UPDATE_EV, (state, that) => {
				that.className = `user-icon s-${state.Match.players[key].status}`
			})
		} else {
			return ''
		}
	});
}

export { TurnStatus };
