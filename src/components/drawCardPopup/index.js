import { Div, Span, P } from '@rebelstack-io/metaflux';
import RoomApi from '../../lib/backend/firebase/room';
import Actions from '../../handlers/actions';
import actions from '../../handlers/actions';

const _storage = global.storage;

function DrawCardPopup () {
	const { czarCard, usedDeck: { whiteCards, blackCards }, selectedCardIds} = global.storage.getState().Match;
	const selectedCards = selectedCardIds.map(id => whiteCards[id]);
	let { text, pick } = blackCards[czarCard];
	let fullText = text;
	let isQuestion = fullText.match(/___/g) === null;
	if (!isQuestion) {
		for (let i = 0; i < selectedCards.length; i++) {
			fullText = fullText.replace(/___/, `<span>${selectedCards[i]}</span>`);
		}
	} else {
		for (let i = 0; i < selectedCards.length; i++) {
			fullText += `<span>${selectedCards[i]}</span>`
		}
	}
	let rawText = fullText.replace(/(<span>|<\/span>)/g, '');
	return Div({
		className: "draw-card-body"
	}, [
		Div({
			style: "text-align: center; margin-bottom: 20px;",
			onclick: e => {
				e.preventDefault();
				console.log('help');
				const speach = new SpeechSynthesisUtterance();
				speach.text = rawText;
				window.speechSynthesis.speak(speach)
			}
		}, Span({
			className: "fa fa-volume-up",
			style: "font-size: 30px; cursor: pointer;"
		})),
		P({
			className: 'draw-card-popup',
			style: 'font-size: 20px;'
		}, fullText),
		Div({
			className: 'footer'
		}, [
			Div({
				onclick: () => {
					const { id, selectedCardIds } = _storage.getState().Match;
					Actions.loadingOn({ msg: 'submitting your stupid card' })
					RoomApi.submitTurn(id, false, selectedCardIds)
					.then(res => {
						console.log(res.data);
						Actions.cancelSelection();
						Actions.closePopUp();
						Actions.loadingOff();
					})
				}
			}, [Span({className: "fa fa-check-circle"}), Span(false, "Play Card")]),
			Div({
				onclick: () => {
					Actions.closePopUp();
				}
			}, [Span({className: "fa fa-times-circle"}), Span(false, "Cancel")])
		])
	]);
}

export default DrawCardPopup;
