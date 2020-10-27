import { Div, Img, Span } from '@rebelstack-io/metaflux';
import Card from '../../components/card';

const _storage = global.storage;
const UPDATE_EV = 'MATCH_UPDATE';

const Czar = () => Div({
	className: 'czar-top'
}, [
	_getBlackCard(),
	TurnStatus(),
	WhiteSubmits()
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
const TurnStatus = () => Div({ className: 'turn-viewer' }, _getTurnContent())
	.onStoreEvent(UPDATE_EV, (_, that) => {
		that.append(..._getTurnContent())
	})

function _getTurnContent() {
	const { players } = _storage.getState().Match;
	const { uid } = _storage.getState().Main.user;
	return Object.keys(players).map((key) => {
		const pl = players[key];
		if(key !== uid) {
			return Div({
				className: `user-icon s-${pl.status}`, id: `trn-${key}`
			}, Img( { src: pl.photoURL } ))
			.onStoreEvent(UPDATE_EV, (state, that) => {
				that.className = `user-icon s-${state.Match.players[key].status}`
			})
		} else {
			return Div()
		}
	});
}

const WhiteSubmits = () => Div({ className: 'submits' }, () => {
	const isReadyToShow = _chekcReady();
	return isReadyToShow ? _getWaitingSubmits() : _getWaitingSubmits()
}).onStoreEvent(UPDATE_EV, (state, that) => {
	const isReadyToShow = _chekcReady();
	that.innerHTML = '';
	let content = isReadyToShow ? _getWaitingSubmits() : _getWaitingSubmits();
	that.append(...content);
})

function _chekcReady() {
	const { players } = _storage.getState().Match;
	const { uid } = _storage.getState().Main.user;
	Object.keys(players).forEach(k => {
		const p = players[k];
		if(uid !== k) {
			if (p.status !== 'R') return false;
		}
	})
	return true
}

function _getWaitingSubmits() {
	const { players, selectedCardsLimit } = _storage.getState().Match;
	const { uid } = _storage.getState().Main.user;
	return Object.keys(players).map(key => {
		const pl = players[key]
		let content = [];
		if (uid !== key) {
			for (let i=0; i < selectedCardsLimit; i++) {
				content.push(Div({ id: `subm-${ key }-${i}` }, () => (
					Span({ className: 'modal-spinner' })
				)))
			}
		}
		return Div({ className: 'submit-wrapper' }, content);
	})
}

/*----------------------------------------------------------------------------------------*/
export {
	Czar
}
