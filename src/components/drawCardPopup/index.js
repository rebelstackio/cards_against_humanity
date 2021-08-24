import { Div, Span, P } from '@rebelstack-io/metaflux';
import RoomApi from '../../lib/backend/firebase/room';
import Actions from '../../handlers/actions';
import { BlackPreview } from '../BlackPreview';


const _storage = global.storage;

function DrawCardPopup () {
	const { czarCard, usedDeck: { whiteCards, blackCards }, selectedCardIds} = global.storage.getState().Match;
	const pl = _storage.getState().Main.user;
	const selectedCards = selectedCardIds.map(id => whiteCards[id]);
	let { text } = blackCards[czarCard];
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
	return BlackPreview(fullText, false, true, { pid: pl.uid, submits: selectedCardIds, pl }, true)
	/*return Div({
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
					global.gameSounds.Play('PICK');
					const { id, selectedCardIds } = _storage.getState().Match;
					Actions.loadingOn({ msg: 'submitting your stupid card' })
					RoomApi.submitTurn(id, false, selectedCardIds)
					.then(() => {
						console.log('#> Card Submited');
						Actions.closePopUp();
						Actions.cancelSelection();
						Actions.loadingOff();
					})
				}
			}, [Span({className: "fa fa-check-circle"}), Span(false, "Play Card")]),
			Div({
				onclick: () => {
					Actions.closePopUp();
					Actions.cancelSelection();
				}
			}, [Span({className: "fa fa-times-circle"}), Span(false, "Cancel")])
		])
	]);*/
}

export default DrawCardPopup;
