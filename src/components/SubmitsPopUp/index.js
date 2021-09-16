import { Div, Span, H3 } from '@rebelstack-io/metaflux';
import { TurnStatus } from '../TurnStatus';
import { checkReady } from '../../util';
import MatchData from '../../controllers/MatchDataManager';
import { BlackPreview } from '../BlackPreview';
import { WinnerCard } from '../WinnerCard';


const _storage = global.storage;
const UPDATE_EV = 'MATCH_UPDATE';
/**
 * Popup Component
 */
const SubmitPopUp = () => Div({ className: 'popup-wrapper hidden' }, [
	Div({}, _getContent())
	.onStoreEvent(UPDATE_EV, (state, that) => {
		that.innerHTML = '';
		const { user: { uid } } = state.Main;
		const { status } = state.Match.players[uid];
		if(status === 'R') {
			that.parentElement.classList.remove('hidden');
		} else if (status === 'P') {
			that.parentElement.classList.add('hidden');
		}
		that.append(..._getContent());
	})
])
/**
 * get popup content
 */
function _getContent() {
	const isReady = checkReady();
	const winner = MatchData.checkForWinner();
	let title = isReady ? 'Waiting for the Czar' : 'Players are picking';
	if (winner) title = 'We have a stupid winner!';
	return [
		H3({ className: 'submit-title' }, title),
		TurnStatus(),
		Div({className: 'all-submits'}, _getSubmits())
	]
}
/**
 * Get non-czar players submits
 */
function _getSubmits() {
	let winner = MatchData.checkForWinner();
	console.log(winner ? '#> there is a winner' : 'not winner yet');
	if ( winner ) return _getWinnerContent(winner);
	return _getSubmitContent()
}
/**
 * get all submits
 */
function _getSubmitContent() {
	const { user: { uid } } =_storage.getState().Main
	const submits = MatchData.getSubmits();
	let isReady = checkReady();
	console.log(isReady ? '#> Every one is ready' : 'not Ready');
	return submits.map(sbm => {
		if(isReady || sbm.uid === uid) {
			return _getTextCard(sbm.submits, uid)
		} else {
			return Div({ className: 'submits-wrapper' }, () => {
				return _getLoadingCard()
			})
		}
	})
}
/**
 * get the winner card
 * @param {Object} winner winner object
 */
function _getWinnerContent(winner) {
	const pid = Object.keys(winner)[0];
	const pl = _storage.getState().Match.players[pid];
	const {usedDeck: { blackCards }, czarCard} = _storage.getState().Match;
	const { text } = blackCards[czarCard];
	const fullText = getFullText(winner[pid], text)
	console.log(winner);
	return WinnerCard({ pl, fullText })
}

/**
 * get loading state when other players picking
 */
function _getLoadingCard() {
	return Div({ className: 'Loading-submit' },Span({ className: 'modal-spinner' }))
}
/**
 * Get a preview for a card
 * @param {Array} submits Array of played cards
 */
function _getTextCard(submits, pid) {
	const { usedDeck: { blackCards }, czarCard, players } = _storage.getState().Match;
	let { text } = blackCards[czarCard];
	const pl = players[pid];
	let fullText = getFullText(submits, text)
	return Div({ className:!_checkWinner(pid)
		? 'submits-wrapper'
		: 'submits-wrapper winner-card'}, () => {
			return BlackPreview(fullText, false, _checkWinner(pid), { pl })
	})
}

function getFullText(submits, text) {
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

function _checkWinner(pid) {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	return lastRound.winner[pid] !== undefined;
}

export { SubmitPopUp };
