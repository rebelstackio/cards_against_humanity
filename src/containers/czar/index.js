import { Div, Img, Span } from '@rebelstack-io/metaflux';
import Card from '../../components/card';
import { TurnStatus } from '../../components/TurnStatus';
import { PreviewSubmit } from '../../components/PreviewSubmit';
import { LoadignModal } from '../../components/LoadingModal';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';

const _storage = global.storage;
const UPDATE_EV = 'MATCH_UPDATE';

const Czar = () => Div({
	className: 'czar-top'
}, [
	_getBlackCard(),
	TurnStatus(),
	WhiteSubmits(),
	LoadignModal()
]);

function _getBlackCard() {
	const card = new Card('', 'black', 0)
	return card.onStoreEvent(UPDATE_EV, (_, that) => {
		let { czarCard, usedDeck} = _storage.getState().Match;
		let { text } = usedDeck.blackCards[czarCard];
		that.querySelector('div').innerHTML = text
	});
}
/*----------------------------------------------------------------------------------- */
const WhiteSubmits = () => Div({ className: 'submits' }, () => {
	let isReadyToShow = _chekcReady();
	return isReadyToShow ? _getPreview() : _getWaitingSubmits()
}).onStoreEvent(UPDATE_EV, (state, that) => {
	let isReadyToShow = _chekcReady();
	console.log(isReadyToShow, _chekcReady())
	that.innerHTML = '';
	let content = isReadyToShow ? _getPreview() : _getWaitingSubmits();
	that.append(...content);
})

function _chekcReady() {
	const { players } = _storage.getState().Match;
	for(let k in players) {
		const p = players[k];
		if(!p.isCzar) {
			console.log(p.status, p.status === 'R');
			if (p.status !== 'R') return false;
		}
	}
	return true
}

function _getPreview() {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	if(!lastRound) return [];
	return Object.keys(lastRound.whiteCards).map((_k) => {
		const wc = lastRound.whiteCards[_k];
		return Div({ className: 'submits-wrapper' }, () => {
			return _getTextCard(wc, _k)
		})
	})
}

/**
 * Get a preview for a card
 * @param {Array} submits Array of played cards
 * @param {String} pid Player id
 */
function _getTextCard(submits, pid) {
	const { usedDeck: { whiteCards, blackCards }, czarCard, id } = _storage.getState().Match;
	let { text, pick } = blackCards[czarCard];
	let fullText = text;
	let isQuestion = (pick < 2) && fullText.match(/___/g) === null;
	let isRoundOver = _checkIsWinner();
	if (!isQuestion) {
		for (let i = 0; i < submits.length; i++) {
			let subm = submits[i];
			fullText = fullText.replace(/___/, `<span>${whiteCards[subm]}</span>`);
		}
	} else {
		console.log(submits)
		fullText += `<span>${whiteCards[submits[0]]}</span>`
	}
	return PreviewSubmit({
		fullText,
		footer: !isRoundOver
		? {
			submit: 'Pick this',
			submitHandler: () => {
				Actions.loadingOn({ msg: 'Choosing round winner' })
				RoomApi.submitTurn(id, true, submits, pid)
				.then(res => {
					console.log(res)
					Actions.loadingOff();
				})
			}
		}
		: false
	});
}

function _getWaitingSubmits() {
	const { players, selectedCardsLimit } = _storage.getState().Match;
	return Object.keys(players).map(key => {
		const pl = players[key]
		let content = [];
		if (!pl.isCzar) {
			for (let i=0; i < selectedCardsLimit; i++) {
				content.push(Div({ id: `subm-${ key }-${i}` }, () => (
					Span({ className: 'modal-spinner' })
				)))
			}
		}
		return Div({ className: 'submit-wrapper' }, content);
	})
}
/**
 * Check if the round have a winner
 */
function _checkIsWinner() {
	const { rounds } = _storage.getState().Match;
	const lastRound = rounds[rounds.length - 1];
	return JSON.stringify(lastRound.winner) !== JSON.stringify({})
}

/*----------------------------------------------------------------------------------------*/
export {
	Czar
}
