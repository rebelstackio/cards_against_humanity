import { Div, H3, HTMLElementCreator } from '@rebelstack-io/metaflux';
import { TurnStatus } from '../../components/TurnStatus';
import { checkReady } from '../../util';
import { Settings } from '../../components/Settings';
import { BlackPreview } from '../../components/BlackPreview';
import MatchData from '../../controllers/MatchDataManager';
import { WinnerCard } from '../../components/WinnerCard';

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
			_handleScroll();
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
	return Div({ className: 'all-submits' }, () => {
		const contentArr = submits.map(sb => {
			console.log(sb);
			const pl = global.storage.getState().Match.players[sb.uid];
			const fullText = replaceBlanks(sb.submits, text);
			const data = { pl, submits: sb.submits, pid: sb.uid };
			return BlackPreview(fullText, true, false, data)
		});
		contentArr.push(
			Div({ className: 'handler-back' }),
			Div({ className: 'handler-right' })
		)
		return contentArr;
	})
}
/**
 * handle scroll for the submits
 */
function _handleScroll () {
	const parent = document.querySelector('.all-submits');
	const left = parent.querySelector('.handler-back');
	const right = parent.querySelector('.handler-right');
	let calculate = () => {
		// if the scroll is at the start disable back
		if (parent.scrollLeft === 0) {
			left.classList.add('disabled')
		} else {
			left.classList.remove('disabled');
		}
		// if scroll is at the end disable next
		if (parent.scrollLeft === parent.scrollWidth) {
			right.classList.add('disabled')
		} else {
			right.classList.remove('disabled');
		}
		// if there is no scroll disable both
		if (parent.offsetWidth === parent.scrollWidth) {
			left.classList.add('disabled');
			right.classList.add('disabled');
	}
	}
	calculate();
	right.onclick = () => {
		if (right.classList.contains('disabled')) return;
		parent.scrollLeft += 230;
		calculate();
	}
	left.onclick = () => {
		if (left.classList.contains('disabled')) return;
		parent.scrollLeft -= 230;
		calculate();
	}
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
/**
 * Check if the round have a winner
 */
function _checkIsWinner() {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	return JSON.stringify(lastRound.winner) !== JSON.stringify({})
}

export {
	Czar
}
