import { Div, Span, Button } from '@rebelstack-io/metaflux';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';

const speach = new SpeechSynthesisUtterance();

function BlackPreview(text ,isPickable, isUserShow, data) {
	const { pl, submits, pid } = data;
	return Div({ className: 'black-preview' },[
		Div({ className: 'user' },
				isUserShow
					? Div({ className: 'avatar', style: `background-image: url(${pl.photoURL});` })
					: Span({}, '?')
		),
		Div({}, [
			Div({ className: 'card-content' }, [
				Span({ className: 'card-text' }, text),
				Button({ className: 'speaker', onclick: () => { speak(text) } })
			]),
			isPickable
			? Button({ className: 'btn-warn', onclick: () => { handleSubmit(submits, pid) } }, 'PICK THIS')
			: ''
		])
	])
}
/**
 * Speach Synthesis handler
 */
function speak(text) {
	const rawText = text.replace(/(<span>|<\/span>)/g, '');
	speach.text = rawText;
	window.speechSynthesis.speak(speach)
}
/**
 * submit winner by czar
 * @param {Array} submits Array of submits
 * @param {String} pid UDI from the winner
 */
function handleSubmit(submits, pid) {
	const {id} = global.storage.getState().Match;
	console.log(submits, pid, id);
	global.gameSounds.Play('PICK');
	Actions.loadingOn({ msg: 'Choosing round winner' })
	RoomApi.submitTurn(id, true, submits, pid)
	.then(() => {
		console.log('#> Czar submited winner');
		Actions.loadingOff();
	})
}

export { BlackPreview }
