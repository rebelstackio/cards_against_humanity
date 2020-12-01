import { Div, Span, H3 } from '@rebelstack-io/metaflux';
import Card from '../../components/card';
import { TurnStatus } from '../../components/TurnStatus';
import { PreviewSubmit } from '../../components/PreviewSubmit';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';
import { checkReady } from '../../util';
import { Settings } from '../../components/Settings';
import MatchData from '../../controllers/MatchDataManager';

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
/**
 *
 */
const WhiteSubmits = () => Div({ className: 'submits' }, () => {
	let isReadyToShow = checkReady();
	console.log(isReadyToShow ? '#> Every one is ready' : 'not Ready');
	return isReadyToShow ? _getPreview() : _getWaitingSubmits()
}).onStoreEvent(UPDATE_EV, (state, that) => {
	let isReadyToShow = checkReady();
	let isEmpty =  that.innerHTML === '';
	console.log(isReadyToShow ? '#> Every one is ready' : 'not Ready');
	if (isReadyToShow || isEmpty) {
		that.innerHTML = '';
		console.log(isReadyToShow ? '#>Czar Ready to see the submits' : 'init submits components');
		let content = isReadyToShow ? _getPreview() : _getWaitingSubmits()
		that.append(...content);
	}
})
/**
 * Get the black cards with the payers submits
 */
function _getPreview() {
	const submits = MatchData.getSubmits();
	return submits.map((sbm) => {
		return Div({ className: 'submits-wrapper' }, () => {
			return _getTextCard(sbm.submits, sbm.uid)
		})
	})
}

/**
 * Get a preview for a card
 * @param {Array} submits Array of played cards
 * @param {String} pid Player id
 */
function _getTextCard(submits, pid) {
	const { usedDeck: { blackCards }, czarCard, id } = _storage.getState().Match;
	let { text } = blackCards[czarCard];
	let fullText = text;
	let isQuestion = fullText.match(/___/g) === null;
	let isRoundOver = _checkIsWinner();
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
	return PreviewSubmit({
		fullText,
		footer: !isRoundOver
		? {
			submit: 'Pick this',
			submitHandler: () => {
				global.gameSounds.Play('PICK');
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
	//const { players, selectedCardsLimit } = _storage.getState().Match;
	/* return Object.keys(players).map(key => {
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
	}) */
	return [
		Div({ className: 'waiting-for-players' }, [
			H3({}, 'Waiting for your dumb friends to pick'),
			Span({ className: 'modal-spinner' })
		])
	]
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
