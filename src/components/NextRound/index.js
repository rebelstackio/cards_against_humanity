import { Div, Button, Span } from '@rebelstack-io/metaflux';
import HostApi from '../../lib/backend/firebase/host';

const _storage = global.storage;

const NextRound = () => Div({className: 'next-turn away'},[
	Span({}, 'Next Turn'),
	Button({
		className: 'btn black',
		onclick: () => {
			const { id, rounds, players, pool, winningScore } = _storage.getState().Match;
			console.log('click next turn');
			HostApi.NextRound(id, rounds, players, pool, winningScore)
		}
	}, 'GO!')
]).onStoreEvent('MATCH_UPDATE', (state, that) => {
	if (_checkIsWinner() && state.Match.isHost) {
		that.classList.remove('away')
	} else {
		that.classList.add('away');
	}
})

/**
 * Check if the round have a winner
 */
function _checkIsWinner() {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	if(!lastRound) return false;
	return JSON.stringify(lastRound.winner) !== JSON.stringify({})
}

export { NextRound };
