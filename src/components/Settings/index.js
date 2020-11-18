import { Div, Button, Span, Img, H3 } from '@rebelstack-io/metaflux';
import { ConfirmationPopUp } from '../ConfirmationPopup';
import MatchApi from '../../controllers/MatchAPI';
import Actions from '../../handlers/actions';

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
		content.append(_getGuestContent())
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
					handler: () => { /** TODO: */ }
				},
				cancel: {
					text: `No, keep my stupid game`,
					handler: function () {
						this.parentElement.parentElement.parentElement.classList.add('hidden')
					}
				}
			} })
		}}, 'Delete Game'),
		_getPlayers()
	]
}


/**
 * get players list (HOST ONLY)
 *
 */
function _getPlayers() {
	const players = MatchApi.getPlayers();
	return Div({ className: 'players-box' }, () => (
		players.map(pl => {
			return Div({}, [
				Span({}, pl.displayName),
				Img({ src: pl.photoURL }),
				Div({ className: 'kick_icom', onclick:() => _kickPlayer(pl) },
					Span({ className: 'fas fa-skull-crossbones'})
				)
			])
		})
	))
}
/**
 * Handle kick player
 * @param {Object} pl player object
 */
function _kickPlayer(pl) {
	Actions.displayConfirmation({ data: {
		text: `Kick player ${pl.displayName}?`,
		submit: {
			text: 'Do it!',
			handler: () => { /** TODO: */ }
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
 * get guest content
 */
function _getGuestContent () {
	return Div({ className: 'guest_settigns' }, [
		Button({ className: 'btn black', onclick: () => {
			Actions.displayConfirmation({ data: {
				text: `Leave the mathc? you can comeback any time`,
				submit: {
					text: 'Do it!',
					handler: () => { /** TODO: */ }
				},
				cancel: {
					text: `No, keep playing this stupid game`,
					handler: function () {
						this.parentElement.parentElement.parentElement.classList.add('hidden')
					}
				}
			} })
		}}, 'Leave Game')
	]);
}

export { Settings }
