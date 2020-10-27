import { Div, Span, P } from '@rebelstack-io/metaflux';

function DrawCardPopup () {
	const { czarCard, usedDeck: { whiteCards, blackCards }, selectedCardIds} = global.storage.getState().Match;
	const selectedCards = selectedCardIds.map(id => whiteCards[id]);
	let { text, pick } = blackCards[czarCard];
	let fullText = text;
	let isQuestion = (pick < 2) && fullText.match(/___/g) !== null;
	if (!isQuestion) {
		for (let i = 0; i < selectedCards.length; i++) {
			fullText = fullText.replace(/___/, `<span>${selectedCards[i]}</span>`);
		}
	} else {
		fullText += `<span>${selectedCards[i]}</span>`
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
					global.storage.dispatch({
						type: 'CLOSE_POPUP'
					});
				}
			}, [Span({className: "fa fa-check-circle"}), Span(false, "Play Card")]),
			Div({
				onclick: () => {
					global.storage.dispatch({
						type: 'CLOSE_POPUP'
					});
				}
			}, [Span({className: "fa fa-times-circle"}), Span(false, "Cancel")])
		])
	]);
}

export default DrawCardPopup;
