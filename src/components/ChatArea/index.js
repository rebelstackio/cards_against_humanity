import { Div, Span, Img} from '@rebelstack-io/metaflux';
import { ChatInput } from '../ChatInput';
import MessaginApi from '../../lib/backend/firebase/messaging';

const _storage = global.storage;
const { id } = _storage.getState().Match;
let isListen = false;
let listener = null;

if(id) {
	_listentMessages(id);
	isListen = true;
}

_storage.on('MATCH_UPDATE', () => {
	const { id } = _storage.getState().Match;
	if(!isListen && id) {
		_listentMessages(id);
		isListen = true;
	}
})
/**
 * Message display area
 */
const msgArea = Div({ className: 'msg-area' });
const ChatArea = () => Div({ className: 'chat-area' }, [
	msgArea,
	ChatInput(),
	Div({ className: 'toggle-btn', onclick: _toggle })
]);
/**
 * Toggle the chat area
 */
function _toggle() {
	const chatArea = document.querySelector('.chat-area');
	chatArea.classList.toggle('toggled');
}

/**
 * Listen to RoomID
 * @param {String} id RoomID
 */
function _listentMessages(id) {
	listener = MessaginApi.onMessage(id, (snap) => {
		const data = snap.data();
		const { players } = _storage.getState().Match;
		if(!data || data === null) return;
		// clean the old DOM
		msgArea.innerHTML = '';
		Object.keys(data)
		.sort((a, b) => {
			if (a > b) {
				return 1
			} else if (a < b) {
				return -1
			}
			return 0
		})
		.forEach(_date => {
			const payload = data[_date];
			let from = players[payload.uid];
			from.uid = payload.uid;
			_appendMessage( from, payload.msg, getTime(_date) );
		})
	})
}
/**
 * get the hours, minutes and secconds 00:00:00 type of date
 * @param {String} _date
 */
function getTime(_date) {
	let _d = new Date(parseInt(_date));
	return `${_d.getHours()}:${_d.getMinutes()}`;
}

_storage.on('MESSAGE_ARRIVE', ( action ) => {
	const { players } = _storage.getState().Match;
	const from = players[action.payload.uid];
	from.uid = action.payload.uid;
	_appendMessage( from, action.payload.message );
});

function _appendMessage(from, msg, date) {
	const { uid } = _storage.getState().Main.user;
	const el = Div({ className: uid === from.uid ? 'msg-wrapper right' : 'msg-wrapper left' },
	[
		Div({ className: 'avatar', style: `background-image: url(${from.photoURL});`}),
		Div({ className: 'msg-body' }, [
			Span({}, msg),
			Span({className: 'date'}, date)
		])
	]);
	msgArea.appendChild(el);
	msgArea.scrollTop = msgArea.scrollHeight;
}

export { ChatArea }
