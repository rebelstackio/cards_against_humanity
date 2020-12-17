import { Div, Span, P, Img } from '@rebelstack-io/metaflux';

const PreviewSubmit = (props) => {
	const { fullText, footer, isWinner, uid } = props;
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
		_getFooter(footer),
		isWinner ? _getWinnerAvatar(uid) : ''
	]);
}
/**
 * get the winner avatar
 * @param {String} uid user id
 */
function _getWinnerAvatar(uid) {
	const { players } = global.storage.getState().Match;
	if (!players[uid]) return;
	return Img({ src: players[uid].photoURL });
}

function _getFooter(footer) {
	if (!footer) return Div();
	return Div({
		className: 'footer'
	}, [
		Div({
			onclick: footer.submitHandler,
		}, [Span({className: "fa fa-check-circle"}), Span(false, footer.submit)]),
		footer.cancel
		? Div({
			onclick: footer.cancelHandler,
		}, [Span({className: "fa fa-times-circle"}), Span(false, footer.cancel)])
		: ''
	])
}

export { PreviewSubmit }
