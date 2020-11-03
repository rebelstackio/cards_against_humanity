import { Div, Span, Input} from '@rebelstack-io/metaflux';
import MessagingApi from '../../lib/backend/firebase/messaging';

const _storage = global.storage;
/**
 * Input chat component
 */
const ChatInput = () => Div({ className: 'chat-input' },
	Div({},
	[
		Input({placeholder: 'your stupid message goes here', onkeyup: (e) => {
			const { key, target } = e;
			if ( key === 'Enter' ) {
				_sendMessage(target)
			}
		}}),
		Div( { onclick: _touchMessage}, Span({ className: 'fas fa-caret-right' }) )
	])
);
/**
 * Handle click event for sending message
 */
function _touchMessage() {
	const inp = this.previousElementSibling;
	console.log(inp);
	_sendMessage(inp)
}
/**
 * Send message and random set placeholder
 * @param {HTMLInputElement} inp Input element
 */
function _sendMessage(inp) {
	if(inp.value !== '') {
		//_storage.dispatch({ type: 'SEND_MESSAGE', msg: inp.value })
		const { uid } = _storage.getState().Main.user;
		const { id } = _storage.getState().Match;
		MessagingApi.sendMessage({ msg: inp.value, uid, id })
		.then(() => {
			console.log('message sent');
		})
		// clean input
		inp.placeholder = _getPlaceholder(inp.placeholder);
		inp.value = '';
	}
}
/**
 * Get random message for the placeholder
 * @param {String} ph current placeholder for no repeating
 */
function _getPlaceholder(ph) {
	const list = [
		'You\'re not fooling anyone, come out of the closet already.',
		'Ask your friends who\'s bring the dildo.',
		'Really? you call this freak show friends?',
		'You should download a real game, not this shit',
		'No one is replying? maybe you\'re the annoying friend.',
		'With that face no wonder why you like wearing a mask'
	]
	const max = list.length - 1;
	const randomElement = list[Math.floor(Math.random() * (max - 0) + 0)];
	return ph === randomElement
		? _getPlaceholder(ph)
		: randomElement
}

export { ChatInput }
