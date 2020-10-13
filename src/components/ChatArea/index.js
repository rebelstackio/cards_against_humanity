import { Div, Span, Img} from '@rebelstack-io/metaflux';
import { ChatInput } from '../ChatInput';

const _storage = global.storage;
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

export { ChatArea }