import { Div, Button, Span, Img, H3 } from '@rebelstack-io/metaflux';
import MatchData from '../../controllers/MatchDataManager';
import HostAPI from '../../lib/backend/firebase/host';
import Actions from '../../handlers/actions';
import RoomApi from '../../lib/backend/firebase/room';

const _storage = global.storage;

const Settings = () => Div({
	className: 'settings-wrapper away'
}, [_getContent()])
.onStoreEvent('MATCH_UPDATE', (_, that) => {
	that.innerHTML = '';
	that.append(_getContent());
})

function _getHandler() {
	return Div({ className: 'setting-handler', onclick: function () {
		const parent = this.parentElement.parentElement;
		parent.classList.toggle('away');
	} },
		Span({
			className:'fas fa-bars'
		})
	);
}
/**
 * get Component content
 */
function _getContent () {
	const { isHost } = _storage.getState().Match;
	let content = Div({ className: 'setting-box' }, [
		H3({}, 'Settings'),
		_getHandler()
	]);
	if (isHost) {
		// host content
		content.append(..._getHostContent())
	} else {
		content.append(..._getGuestContent())
	}
	return content;
}

function _getHostContent () {
	return [
		Button({ className: 'btn black', onclick: () => {
			Actions.displayConfirmation({ data: {
				text: `This will delete the game progress, are you sure?`,
				submit: {
					text: 'Do it!',
					handler: _deleteGameHandler
				},
				cancel: {
					text: `No, keep my stupid game.`,
					handler: function () {
						this.parentElement.parentElement.parentElement.classList.add('hidden')
					}
				}
			} })
		}}, 'Delete Game'),
		H3({}, 'Players'),
		_getPlayers(true)
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
 * get players list (HOST ONLY)
 *
 */
function _getPlayers(isHost) {
	const players = MatchData.getPlayers(true);
	const { user: { uid } } = _storage.getState().Main;
	return Div({ className: 'players-box' }, () => (
		players.map(pl => {
			return Div({}, [
				Img({ src: pl.photoURL }),
				Span({}, pl.displayName),
				(isHost && uid !== pl.uid) ? _getKickButton(pl) : Div(),
				Span({}, `Awsome Points: ${pl.score}`)
			])
		})
	))
}
/**
 * kick button
 * @param {Object} pl Player object
 */
function _getKickButton(pl) {
	return Div({ className: 'kick_icom', onclick:() => _kickPlayer(pl) },
		Span({ className: 'fas fa-skull-crossbones'})
	)
}

/**
 * Handle kick player
 * @param {Object} pl player object
 */
function _kickPlayer(pl) {
	const { id } = _storage.getState().Match;
	Actions.displayConfirmation({ data: {
		text: `Kick player ${pl.displayName}?`,
		submit: {
			text: 'Do it!',
			handler: function () {
				_kickPlayerHandler(id, pl, this);
			}
		},
		cancel: {
			text: `No, i have no balls to do it`,
			handler: function () {
				this.parentElement.parentElement.parentElement.classList.add('hidden')
			}
		}
	} })
}
/**
 * Handle confirm player kick
 */
async function _kickPlayerHandler(id, pl, that) {
	that.parentElement.parentElement.parentElement.classList.add('hidden')
	Actions.loadingOn({ msg: `kicking ${pl.displayName}` })
	await HostAPI.kickPLayer(id, pl.uid)
	Actions.loadingOff();
}
/**
 * get guest content
 */
function _getGuestContent () {
	return [
		Button({ className: 'btn black', onclick: () => {
			Actions.displayConfirmation({ data: {
				text: `Leave the game? you can comeback any time.`,
				submit: {
					text: 'Do it!',
					handler: _leaveGameHandler
				},
				cancel: {
					text: `No, keep playing this stupid game`,
					handler: function () {
						this.parentElement.parentElement.parentElement.classList.add('hidden')
					}
				}
			} })
		}}, 'Leave Game'),
		H3({}, 'Players'),
		_getPlayers()
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
