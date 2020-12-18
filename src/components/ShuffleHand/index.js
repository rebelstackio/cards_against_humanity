import { Div, Span } from '@rebelstack-io/metaflux';
import roomApi from '../../lib/backend/firebase/room';
import Actions from '../../handlers/actions';

const _storge = global.storage;

const ShuffleHand = () => Div({ className: 'shuffle-white', onclick: () => {
	const { id } = _storge.getState().Match;
	// start loading
	Actions.loadingOn({ msg: 'Getting new cards' })
	// clear selected cards
	Actions.cancelSelection();
	// call shuffle API
	roomApi.shuffleHand(id);
}},
	Span({ className: 'fas fa-random' })
)
.onStoreEvent('MATCH_UPDATE', (state, that) => {
	const { user: { uid } } = state.Main;
	const { players } = state.Match;
	if (!players[uid].isAllowShuffle){
		that.classList.add('away')
		Actions.loadingOff();
	} else {
		that.classList.remove('away')
	}
})

export { ShuffleHand }
