import { Div, Span, H3, Img, Input} from '@rebelstack-io/metaflux';

const WaitingRoom = () => Div({
	className: 'waiting-room'
}, [
	PlayerSideBar(),
	ChatArea()
]);
/**
 * Sidebar to display connected players
 */
const PlayerSideBar = () => Div({
	className: 'sidebar'
}, [
	H3({}, 'The People'),
	..._getThePeople()
]);
/**
 * get the match players and listed
 */
function _getThePeople() {
	const { match } = global.storage.getState().Main;
	return Object.keys(match.players).map(_uid => {
		const pl = match.players[_uid];
		return Div({className: 'player-box'}, [
			Img({src: pl.photoURL}),
			Span({}, pl.displayName),
			match.id === _uid ? Span({className: 'fas fa-crown'}) : ''
		])
	})
}
/**
 * Message display area
 */
const ChatArea = () => Div({ className: 'chat-area' }, [
	Div({ className: 'msg-area' }),
	ChatInput()
]);
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
		global.storage.dispatch({ type: 'SEND_MESSAGE', msg: inp.value })
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

export {
	WaitingRoom
}
