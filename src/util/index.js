import DeckApi from '../lib/backend/firebase/deck';
import MatchData from '../controllers/MatchDataManager';

const _storage = global.storage;

const getDeck = async function _getDeck(id) {
	const ls = localStorage.getItem(`d_${id}`);
	let res;
	if (ls === null) {
		const doc = await DeckApi.getDeck(id)
		res = doc.data();
		localStorage.setItem(`d_${id}`, JSON.stringify(res));
	} else {
		res = JSON.parse(ls);
	}
	return res;
}
/**
 *
 * @param {*} text
 * @param {*} selectedCards
 */
const getFullText = function _getFullText (text, selectedCards) {
	const { usedDeck: { whiteCards } } = _storage.getState().Match;
	let fullText = text;
	let isQuestion = fullText.match(/___/g) === null;
	for (let i = 0; i < selectedCards.length; i++) {
		let card = whiteCards[selectedCards[i]];
		if (!isQuestion) {
				fullText = fullText.replace(/___/, `<span>${card}</span>`);
		} else {
			fullText += `<span>${card}</span>`
		}
	}
	return fullText;
}
/**
* Check if every non czar player is ready
*/
const checkReady = function _chekcReady() {
	let players = MatchData.getPlayers(true);
	if(players.length === 0) return false;
	for (let i=0; i < players.length; i++) {
		let p = players[i];
		if(!p.isCzar && p.status !== 'D') {
			if (p.status !== 'R') return false;
		}
	}
	return true
}


export {
	getDeck,
	getFullText,
	checkReady
}
