import { Div, Button, MetaComponent } from '@rebelstack-io/metaflux';
import HostAPI from '../../lib/backend/firebase/host';
import Actions from '../../handlers/actions';
import RoomAPI from '../../lib/backend/firebase/room';

class SettingActions extends MetaComponent {
	constructor () {
		super(global.storage);
		this.fallBack = this.fallBack.bind(this);
		this.deleteActions = this.deleteActions.bind(this);
		this.leaveActions = this.leaveActions.bind(this);
		this._kickPlayerHandler = this._kickPlayerHandler.bind(this);
		this._deleteGameHandler = this._deleteGameHandler.bind(this);
		this._leaveGameHandler = this._leaveGameHandler.bind(this);
	}
	render () {
		this.isHost = this.storage.getState().Match.isHost;
		this.content = Div({ className: 'actions-wrapper' },
			this._getDefaultAction()
		);
		return this.content;
	}
	/**
	 * Get the default button
	 */
	_getDefaultAction() {
		return this.isHost
			? Button({ className: 'btn-danger init', onclick: this.deleteActions }, 'Delete Game')
			: Button({ className: 'btn-danger init', onclick: this.leaveActions }, 'Leave Game');
	}
	kickActions() {
		// clean the DOM
		this.content.innerHTML = '';
		this.content.append(
			Button({ className: 'btn-danger', onclick: this._kickPlayerHandler }, 'DO IT!'),
			Button({ className: 'btn-warn', onclick: this.fallBack }, 'NO, I HAVE NO BALLS ')
		)
	}
	deleteActions() {
		// clean the DOM
		this.content.innerHTML = '';
		global._showConfirmation('THIS WILL DELETE THE GAME', '...ARE YOU SURE TO EXIT?');
		this.content.append(
			Button({ className: 'btn-danger', onclick: this._deleteGameHandler }, 'BYE!'),
			Button({ className: 'btn-warn', onclick: this.fallBack }, 'NO, KEEP MY STUPID GAME')
		)
	}

	leaveActions() {
		// clean the DOM
		this.content.innerHTML = '';
		global._showConfirmation('LEAVE THE GAME?', '...ARE YOU SURE TO EXIT?');
		this.content.append(
			Button({ className: 'btn-danger', onclick: this._leaveGameHandler }, 'BYE!'),
			Button({ className: 'btn-warn', onclick: this.fallBack }, 'NO, KEEP PLAYING THIS STUPID GAME')
		)
	}
	/**
	 * Fall back to default state
	 */
	fallBack() {
		// clean the DOM
		this.content.innerHTML = '';
		this.content.append(this._getDefaultAction());
		document.querySelector('.conf-wrapper').classList.add('hidden');
	}
	/**
 * Handle confirm player kick
 */
	async _kickPlayerHandler() {
		const { id } = this.storage.getState().Match;
		Actions.loadingOn({ msg: `kicking ${this.pl.displayName}` })
		await HostAPI.kickPLayer(id, this.pl.uid)
		Actions.loadingOff();
	}
	/**
	 *
	 * @returns
	 */
	async _deleteGameHandler() {
		Actions.loadingOn({ msg: `Deleting your stupid game` })
		const { id } = this.storage.getState().Match;
		await RoomAPI.deleteRoom(id)
		Actions.loadingOff();
		localStorage.removeItem('m_joined');
		document.location.href = '/';
	}
	/**
	 *
	 * @returns
	 */
	 async _leaveGameHandler() {
		Actions.loadingOn({ msg: `Leaving this stupid game` })
		const { id } = this.storage.getState().Match;
		await RoomAPI.leaveRoom(id)
		Actions.loadingOff();
		localStorage.removeItem('m_joined');
		document.location.href = '/';
	}
	/**
	 *
	 */
	handleStoreEvents() {
		return {
			'MATCH_UPDATE': () => {
				this.isHost = this.storage.getState().Match.isHost;
			},
			'KICK_PLAYER': (action) => {
				this.pl = action.pl;
				this.kickActions();
			}
		}
	}
}

window.customElements.define('setting-actions', SettingActions)
