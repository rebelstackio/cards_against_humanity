import { Div, Span, H3 } from '@rebelstack-io/metaflux';
import { PreviewSubmit } from '../PreviewSubmit';
import { TurnStatus } from '../TurnStatus';
import { checkReady } from '../../util';
import MatchData from '../../controllers/MatchDataManager';


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
	console.log(isReady ? '#> Every one is ready' : 'not Ready');
	return [
		H3({ className: 'submit-title' }, isReady ? 'Wating for the Czar' : 'Players are picking'),
		TurnStatus(),
		Div({className: 'all-submits'}, _getSubmits())
	]
}
/**
 * Get non-czar players submits
 */
function _getSubmits() {
	const { user: { uid } } =_storage.getState().Main
	const submits = MatchData.getSubmits();
	let isReady = checkReady();
	console.log(isReady ? '#> Every one is ready' : 'not Ready');
	return submits.map(sbm => {
		if(isReady || sbm.uid === uid) {
			return Div({ className: 'submits-wrapper' }, () => {
				return _getTextCard(sbm.submits, sbm.uid)
			})
		} else {
			return Div({ className: 'submits-wrapper' }, () => {
				return _getLoadingCard()
			})
		}
	})
}
/**
 * get loading state when other players picking
 * @param {String} id
 * @param {Number} i
 */
function _getLoadingCard() {
	return Div({ className: 'Loading-submit' },Span({ className: 'modal-spinner' }))
}
/**
 * Get a preview for a card
 * @param {Array} submits Array of played cards
 */
function _getTextCard(submits, pid) {
	const { usedDeck: { whiteCards, blackCards }, czarCard } = _storage.getState().Match;
	let { text } = blackCards[czarCard];
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
	return PreviewSubmit({ fullText, isWinner: _checkWinner(pid) });
}

function _checkWinner(pid) {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	return lastRound.winner[pid] !== undefined;
}

export { SubmitPopUp };
