import { Div, H3, HTMLElementCreator } from '@rebelstack-io/metaflux';
import { TurnStatus } from '../../components/TurnStatus';
import { checkReady } from '../../util';
import { Settings } from '../../components/Settings';
import { BlackPreview } from '../../components/BlackPreview';
import MatchData from '../../controllers/MatchDataManager';
import { WinnerCard } from '../../components/WinnerCard';
import { CardScroller } from '../../components/CardScroller';

const _storage = global.storage;
const UPDATE_EV = 'MATCH_UPDATE';

_storage.on(UPDATE_EV, () => {
	const { isCzar, status } = _storage.getState().Match
	if(!isCzar && status !== 'E') {
		global.router.go('/game/');
	} else if(status === 'E') {
		global.router.go('/summary/')
	}
})

const Czar = () => Div({
	className: 'czar-top'
}, [
	HTMLElementCreator("czar-indicator", {}),
	HTMLElementCreator("score-board", {}),
	_getCzarByStatus(),
	...Settings()
]);
/**
 * Get the main view by status
 */
function _getCzarByStatus() {
	return Div({ className: 'czar-status' }, _getNotReady())
	.onStoreEvent(UPDATE_EV, (_, that) => {
		const winner = MatchData.checkForWinner();
		console.log(winner ? '#> there is a winner' : 'not winner yet');
		const isReady = checkReady();
		// clean the DOM
		that.innerHTML = '';
		if (winner) {
			that.appendChild(_getWinner(winner));
			return;
		}
		if(!isReady) {
			that.appendChild(_getNotReady())
		} else {
			that.appendChild(_getReady());
		}
	})
}
/**
 * get Winner Content.
 */
function _getWinner(winner) {
	const pid = Object.keys(winner)[0]
	const text = _getBlackCardText();
	const fullText = replaceBlanks(winner[pid], text);
	const pl = _storage.getState().Match.players[pid];
	return Div({ className: 'winner' }, [
		H3({}, 'We have a stupid winner!'),
		WinnerCard({ pl, fullText })
	])
}

/**
 * get information not ready to pick
 */
function _getNotReady() {
	return Div({ className: 'not-ready' }, [
		H3({}, 'Players are picking...'),
		BlackPreview(_getBlackCardText(), false, false, { submits: '', pid: '', pl: '' }),
		TurnStatus()
	])
}
/**
 * get the submits to pick.
 */
function _getReady() {
	return Div({ className: 'ready' }, [
		H3({}, 'PICK THE BEST ANSWER!'),
		AllSubmits()
	])
}
/**
 * Get a list for the submits
 * @returns
 */
function AllSubmits() {
	const submits = MatchData.getSubmits();
	let text = _getBlackCardText();
	const data = submits.map(sb => {
		console.log(sb);
		const pl = global.storage.getState().Match.players[sb.uid];
		const fullText = replaceBlanks(sb.submits, text);
		const data = { pl, submits: sb.submits, pid: sb.uid };
		return BlackPreview(fullText, true, false, data)
	})
	return Div({ className: 'all-submits' }, CardScroller( { data } ))
}

/**
 * Replace blanks in black card text with the submits
 */
function replaceBlanks(submits, text) {
	if(!text) return '';
	let fullText = text;
	let isQuestion = fullText.match(/___/g) === null;
	if (!isQuestion) {
		for (let i = 0; i < submits.length; i++) {
			let subm = submits[i];
			fullText = fullText.replace(/___/, `<span>${subm}</span>`);
		}
	} else {
		for (let i = 0; i < submits.length; i++) {
			let subm = submits[i];
			fullText += `<span>${subm}</span>`
		}
	}
	return fullText
}
/**
 * get black card text
 */
function _getBlackCardText() {
	let { czarCard, usedDeck} = _storage.getState().Match;
	let text = usedDeck.blackCards[czarCard] ? usedDeck.blackCards[czarCard].text : '';
	return text;
}

export {
	Czar
}
