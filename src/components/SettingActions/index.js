import { Div, Button, MetaComponent } from '@rebelstack-io/metaflux';

class SettingActions extends MetaComponent {
	constructor () {
		super(global.storage);
		this.fallBack = this.fallBack.bind(this);
		this.deleteActions = this.deleteActions.bind(this);
		this.leaveActions = this.leaveActions.bind(this);
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
			Button({ className: 'btn-danger' }, 'DO IT!'),
			Button({ className: 'btn-warn', onclick: this.fallBack }, 'NO, I HAVE NO BALLS ')
		)
	}
	deleteActions() {
		// clean the DOM
		this.content.innerHTML = '';
		global._showConfirmation('THIS WILL DELETE THE GAME', '...ARE YOU SURE TO EXIT?');
		this.content.append(
			Button({ className: 'btn-danger' }, 'BYE!'),
			Button({ className: 'btn-warn', onclick: this.fallBack }, 'NO, KEEP MY STUPID GAME')
		)
	}

	leaveActions() {
		// clean the DOM
		this.content.innerHTML = '';
		global._showConfirmation('LEAVE THE GAME?', '...ARE YOU SURE TO EXIT?');
		this.content.append(
			Button({ className: 'btn-danger' }, 'BYE!'),
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
