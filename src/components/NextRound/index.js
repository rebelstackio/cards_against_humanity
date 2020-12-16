import { Div, Button, Span } from '@rebelstack-io/metaflux';
import HostApi from '../../lib/backend/firebase/host';

const _storage = global.storage;

const getCounter = function () {
	let content = Span({}, '15s');
		let interval = setInterval(() => {
			let s = parseInt(content.innerText.replace(/s$/g, '')); s--;
			content.innerText = s + 's';
			if (s === 0) {
				clearInterval(interval);
				if (_storage.getState().Match.isHost) {
					const { id, rounds, players, pool, winningScore } = _storage.getState().Match;
					HostApi.NextRound(id, rounds, players, pool, winningScore)
				}
			}
		}, 1000)
		return content;
}

const NextRound = () => Div({className: 'next-turn away'},[
	Span({}, 'Next Round strarts in: '),
	Span({
		id: 'counter'
	}, '')
]).onStoreEvent('MATCH_UPDATE', (state, that) => {
	if (_checkIsWinner()) {
		that.classList.remove('away');
		that.querySelector('#counter').append(getCounter());
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
