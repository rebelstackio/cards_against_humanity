import { Div, Span, H3 } from '@rebelstack-io/metaflux';
import { PreviewSubmit } from '../PreviewSubmit';
import { TurnStatus } from '../TurnStatus';


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
	const isReady = _chekcReady();
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
	const { rounds } = _storage.getState().Match;
	const { user: { uid } } =_storage.getState().Main
	const lastRound = rounds[rounds.length - 1];
	const isReady = _chekcReady();
	if(!lastRound) return [];
	return Object.keys(lastRound.whiteCards).map((_k) => {
		const wc = lastRound.whiteCards[_k];
		if(isReady || _k === uid) {
			return Div({ className: 'submits-wrapper' }, () => {
				return _getTextCard(wc,_k)//wc.map((id) => _getTextCard(id, _k))
			})
		} else {
			return Div({ className: 'submits-wrapper' }, () => {
				return wc.map((_,i) => _getLoadingCard(_k, i))
			})
		}
	})
}
/**
 * get loading state when other players picking
 * @param {String} id
 * @param {Number} i
 */
function _getLoadingCard(id, i) {
	return Div({ id: `subm-${ id }-${i}` },Span({ className: 'modal-spinner' }))
}
/**
 * Get a preview for a card
 * @param {Array} submits Array of played cards
 */
function _getTextCard(submits, pid) {
	const { usedDeck: { whiteCards, blackCards }, czarCard } = _storage.getState().Match;
	let { text, pick } = blackCards[czarCard];
	let fullText = text;
	let isQuestion = fullText.match(/___/g) === null;
	if (!isQuestion) {
		for (let i = 0; i < submits.length; i++) {
			let subm = submits[i];
			fullText = fullText.replace(/___/, `<span>${whiteCards[subm]}</span>`);
		}
	} else {
		for (let i = 0; i < submits.length; i++) {
			let subm = submits[i];
			fullText += `<span>${whiteCards[subm]}</span>`
		}
	}
	return PreviewSubmit({ fullText, isWinner: _checkWinner(pid) });
}

function _checkWinner(pid) {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	return lastRound.winner[pid] !== undefined;
}
/**
 * Check if every non czar player is ready
 */
function _chekcReady() {
	const { players } = _storage.getState().Match;
	Object.keys(players).forEach(k => {
		const p = players[k];
		if(!p.isCzar) {
			if (p.status !== 'R') return false;
		}
	})
	return true
}

export { SubmitPopUp };
