const _getState = global.storage.getState;
/**
 * Map player from firebase response to a nice array
 * @param {Boolean} isMySelfRequired normally your user is exclude from the lists
 */
const getPlayers = function _getPlayers(isMySelfRequired) {
	const { players } = _getState().Match;
	const { uid } = _getState().Main.user;
	let ret = [];
	Object.keys(players).forEach(pid => {
		const niceObjet = Object.assign({}, players[pid], { uid: pid });
		if (uid === pid) {
			if (isMySelfRequired) ret.push(niceObjet);
		} else if (niceObjet.status !== 'D') {
			ret.push(niceObjet)
		}
	});
	return ret.sort((a, b) => {
		if (a.displayName > b.displayName) {
			return 1
		} else {
			return -1
		}
	});
}
/**
 * get current round
 */
function _getLastRound() {
	const { rounds } = _getState().Match;
	return rounds.pop();
}
/**
 * get submits formated and orderd to avoid changing order in the view
 */
const getSubmits = function _getSubmits() {
	const thisRound = _getLastRound();
	if(!thisRound) return [];
	const { players } = _getState().Match;
	let ret = [];
	Object.keys(thisRound.whiteCards).forEach(_k => {
		ret.push({
			uid: _k,
			submits: _getSubmitText(thisRound.whiteCards[_k]),
			displayName: players[_k].displayName
		})
	})
	return ret.sort((a, b) => {
		if (a.displayName > b.displayName) {
			return 1
		} else {
			return -1
		}
	});
}
/**
 * map index from cards to text
 * @param {Array} submits
 */
function _getSubmitText(submits) {
	const { whiteCards } = _getState().Match.usedDeck;
	return submits.map(s => {
		return whiteCards[s];
	});
}
/**
 * Check if there is a winner for this round and return it
 */
function checkForWinner() {
	const thisRound = _getLastRound();
	if (!thisRound) return false;
	let comp = '{}' !== JSON.stringify(thisRound.winner);
	return comp ? thisRound.winner : false;
}

export default {
	getPlayers,
	getSubmits,
	checkForWinner
}
