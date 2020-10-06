import { Div, Span, H3, Img, Input} from '@rebelstack-io/metaflux';

const _storage = global.storage;

_storage.dispatch({ type: 'LISTEN_CHAT' })

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
	const { match } = _storage.getState().Main;
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
const msgArea = Div({ className: 'msg-area' });
const ChatArea = () => Div({ className: 'chat-area' }, [
	msgArea,
	ChatInput()
]);

_storage.on('MESSAGE_ARRIVE', ( action ) => {
	const { players } = _storage.getState().Main.match;
	const from = players[action.payload.uid];
	from.uid = action.payload.uid;
	_appendMessage( from, action.payload.message );
});

function _appendMessage(from, msg) {
	const { uid } = _storage.getState().Main.user;
	const el = Div({ className: uid === from.uid ? 'msg-wrapper right' : 'msg-wrapper left' },
	[
		Span({}, msg),
		Img({ src: from.photoURL })
	]);
	msgArea.appendChild(el);
	msgArea.scrollTop = msgArea.scrollHeight;
}
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
		_storage.dispatch({ type: 'SEND_MESSAGE', msg: inp.value })
		// this is mock TODO: delete this.
		const { uid } = _storage.getState().Main.user;
		_storage.dispatch({ type: 'MESSAGE_ARRIVE' , payload: { message: inp.value, uid }})
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

export {
	WaitingRoom
}
