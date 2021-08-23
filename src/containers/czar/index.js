import { Div, Span, H3, HTMLElementCreator } from '@rebelstack-io/metaflux';
import { TurnStatus } from '../../components/TurnStatus';
import { PreviewSubmit } from '../../components/PreviewSubmit';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';
import { checkReady } from '../../util';
import { Settings } from '../../components/Settings';
import { BlackPreview } from '../../components/BlackPreview';
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
	HTMLElementCreator("czar-indicator", {}),
	HTMLElementCreator("score-board", {}),
	_getCzarByStatus(),
	...Settings()
]);
/**
 * Get the main view by status
 */
function _getCzarByStatus() {
	return Div({ className: 'czar-status' })
	.onStoreEvent(UPDATE_EV, (_, that) => {
		const isReady = checkReady();
		// clean the DOM
		that.innerHTML = '';
		if(!isReady) {
			that.appendChild(_getNotReady())
		} else {
			that.appendChild(_getReady());
			_handleScroll();
		}
	})
}
/**
 * get information not ready to pick
 */
function _getNotReady() {
	return Div({ className: 'not-ready' }, [
		H3({}, 'Players are picking...'),
		BlackPreview(_getBlackCardText()),
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
			return BlackPreview(replaceBlanks(sb.submits, text), true)
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
	/*
	PreviewSubmit({
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
		: false,
		isWinner: isRoundOver,
		uid: pid
	});*/
}

/**-----------------SOON TO DEPRECATED--------------------- */

function _getBlackCardText() {
	let { czarCard, usedDeck} = _storage.getState().Match;
	let text = usedDeck.blackCards[czarCard] ? usedDeck.blackCards[czarCard].text : '';
	return text;
}
/*----------------------------------------------------------------------------------- */
/**
 *
 *//*
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
})*/
/**
 * Get the black cards with the payers submits
 *//*
function _getPreview() {
	const submits = MatchData.getSubmits();
	return submits.map((sbm) => {
		return Div({ className: 'submits-wrapper' }, () => {
			return _getTextCard(sbm.submits, sbm.uid)
		})
	})
}*/

/**
 * Get a preview for a card
 * @param {Array} submits Array of played cards
 * @param {String} pid Player id
 */


function _getWaitingSubmits() {
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
