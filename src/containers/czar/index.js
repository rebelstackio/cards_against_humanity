import { Div, Img, Span } from '@rebelstack-io/metaflux';
import Card from '../../components/card';

const _storage = global.storage;

const Czar = () => Div({
	className: 'czar-top'
}, [
	_getBlackCard(),
	TurnStatus(),
	WhiteSubmits()
]);

function _getBlackCard() {
	let { text } = _storage.getState().Match.czarCard;
	return new Card(text, 'black', 0);
}
/*----------------------------------------------------------------------------------- */
const TurnStatus = () => Div({ className: 'turn-viewer' }, () => {
	const { players } = _storage.getState().Match;
	return Object.keys(players).map((key) => {
		const pl = players[key];
		return Div({ className: `user-icon s-${pl.status}`, id: `trn-${key}` }, Img( { src: pl.photoURL } ))
	});
});

const WhiteSubmits = () => Div({ className: 'submits' }, () => {
	const isReadyToShow = _chekcReady();
	console.log(_getWaitingSubmits());
	return isReadyToShow ? _getWaitingSubmits() : _getWaitingSubmits()
})

function _chekcReady() {
	const { players } = _storage.getState().Match;
	Object.keys(players).forEach(k => {
		const p = players[k];
		if (p.status !== 'R') return false;
	})
	return true
}

function _getWaitingSubmits() {
	const { players, selectedCardsLimit } = _storage.getState().Match;
	return Object.keys(players).map(key => {
		const pl = players[key]
		let content = [];
		for (let i=0; i < selectedCardsLimit; i++) {
			content.push(Div({ id: `subm-${ key }-${i}` }, () => (
				Span({ className: 'modal-spinner' })
			)))
		}
		return Div({ className: 'submit-wrapper' }, content);
	})
}

/*----------------------------------------------------------------------------------------*/
export {
	Czar
}
