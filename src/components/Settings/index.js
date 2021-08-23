import { Div, Button, Span, Img, H3, HTMLElementCreator } from '@rebelstack-io/metaflux';
import MatchData from '../../controllers/MatchDataManager';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';
import settingsImg from '../../assets/img/botones/menu.svg';
import '../SettingActions';
const _storage = global.storage;

const Settings = () => [Div({
	className: 'settings-wrapper away'
}, [_getContent(), _getHandler()])
.onStoreEvent('MATCH_UPDATE', (_, that) => {
	that.innerHTML = '';
	that.append(_getContent());
}),
_getHandler()
]
/**
 * Get close button
 */
function _getHandler() {
	return Div({ className: 'setting-handler', onclick: function () {
		const parent = document.querySelector('.settings-wrapper');
		parent.classList.toggle('away');
	} },
		Img({ src: settingsImg })
	);
}
/**
 * get Component content
 */
function _getContent () {
	const { isHost } = _storage.getState().Match;
	let content = Div({ className: 'setting-box' }, [
		H3({}, 'Settings'),
		Div({className: 'close', onclick: () => {
			const parent = document.querySelector('.settings-wrapper');
			parent.classList.add('away');
		}})
	]);
	if (isHost) {
		// host content
		content.append(..._getHostContent())
	} else {
		content.append(..._getGuestContent())
	}
	content.append(_getConfirmation());
	return content;
}
/**
 * Get content for the host of the game
 */
function _getHostContent () {
	return [
		_getPlayers(true),
		HTMLElementCreator('setting-actions')
	]
}
/**
 * Handle confirm game delete
 */
async function _deleteGameHandler() {
	const {id} = _storage.getState().Match;
	Actions.loadingOn({ msg: 'Deleting your stupid game.' })
	await RoomApi.deleteRoom(id);
	localStorage.removeItem('m_joined');
	global.router.go('/lobby/host/');
	document.location.reload();
}


/**
 * get players list
 *
 */
function _getPlayers(isHost) {
	const players = MatchData.getPlayers(true);
	const { user: { uid } } = _storage.getState().Main;
	return Div({ className: 'players-box' }, () => (
		players.map(pl => {
			return Div({}, [
				(isHost && uid !== pl.uid) ? _getKickButton(pl) : Div(),
				Span({}, pl.displayName),
				_getPoints(pl)
			])
		})
	))
}
/**
 *
 */
function _getPoints(pl) {
	return 	Div({ className: 'score' }, [Span({}, `x${pl.score}`), Span({className: 'score-coin'})])
}

/**
 * kick button
 * @param {Object} pl Player object
 */
function _getKickButton(pl) {
	return Div({ className: 'delete-btn', onclick:() => _kickPlayer(pl) })
}
/**
 * Get notification text
 * @param {Strign} text1 Message 1
 * @param {String} text2 Message 2
 * @returns HTMLDivElement
 */
function _getConfirmation() {
	return Div({ className: 'conf-wrapper hidden' }, [
		Div({className: 'text-1'}, 'Placeholder 1'),
		Div({}),
		Div({className: 'text-2'}, 'Placeholder 2')
	])
}
/**
 * Display confirmation messages
 * @param {String} text1 message 1
 * @param {String} text2 Message 2
 */
global._showConfirmation = function(text1, text2) {
	const wrapper = document.querySelector('.conf-wrapper');
	const textW1 = wrapper.querySelector('.text-1');
	const textW2 = wrapper.querySelector('.text-2');
	wrapper.classList.remove('hidden');
	textW1.innerHTML = text1;
	textW2.innerHTML = text2;
}

/**
 * Handle kick player
 * @param {Object} pl player object
 */
function _kickPlayer(pl) {
	global._showConfirmation('Are you sure', '...Kick player');
	Actions.kickPlayer({ pl });
}

/**
 * get guest content
 */
function _getGuestContent () {
	return [
		_getPlayers(),
		HTMLElementCreator('setting-actions')
	]
}
/**
 * Handle confirm leave game.
 */
async function _leaveGameHandler () {
	const { id } = _storage.getState().Match;
	Actions.loadingOn({msg: 'See ya nerds!'});
	this.parentElement.parentElement.parentElement.classList.add('hidden');
	localStorage.removeItem('m_joined')
	await RoomApi.leaveRoom(id)
	global.router.go('/lobby/host/');
	document.location.reload();
}

export { Settings }
