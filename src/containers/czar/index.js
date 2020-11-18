import { Div, Span, H3 } from '@rebelstack-io/metaflux';
import Card from '../../components/card';
import { TurnStatus } from '../../components/TurnStatus';
import { PreviewSubmit } from '../../components/PreviewSubmit';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';
import { checkReady } from '../../util';
import { Settings } from '../../components/Settings';

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
	_getBlackCard(),
	CzarHeader(),
	WhiteSubmits(),
	Settings()
]);

function _getBlackCard() {
	const card = new Card(_getBlackCardText(), 'black', 0)
	return card.onStoreEvent(UPDATE_EV, (_, that) => {
		that.querySelector('div').innerHTML = _getBlackCardText();
	});
}

function _getBlackCardText() {
	let { czarCard, usedDeck} = _storage.getState().Match;
	let text = usedDeck.blackCards[czarCard] ? usedDeck.blackCards[czarCard].text : '';
	return text;
}

const CzarHeader = () => Div({ className: 'czar-header' }, [
	H3({}, `You're the czar`),
	TurnStatus()
])

/*----------------------------------------------------------------------------------- */
const WhiteSubmits = () => Div({ className: 'submits' }, () => {
	let isReadyToShow = checkReady();
	return isReadyToShow ? _getPreview() : _getWaitingSubmits()
}).onStoreEvent(UPDATE_EV, (state, that) => {
	let isReadyToShow = checkReady();
	that.innerHTML = '';
	let content = isReadyToShow ? _getPreview() : _getWaitingSubmits();
	that.append(...content);
})

function _chekcReady() {
	const { players } = _storage.getState().Match;
	for(let k in players) {
		const p = players[k];
		if(!p.isCzar) {
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
	let isQuestion = fullText.match(/___/g) === null;
	let isRoundOver = _checkIsWinner();
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
	return PreviewSubmit({
		fullText,
		footer: !isRoundOver
		? {
			submit: 'Pick this',
			submitHandler: () => {
				Actions.loadingOn({ msg: 'Choosing round winner' })
				RoomApi.submitTurn(id, true, submits, pid)
				.then(() => {
					console.log('#> Czar submited winner');
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
