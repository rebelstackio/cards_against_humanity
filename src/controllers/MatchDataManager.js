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

export default {
	getPlayers
}
