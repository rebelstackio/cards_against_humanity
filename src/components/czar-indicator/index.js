import { MetaComponent, Div } from '@rebelstack-io/metaflux';

class CzarIndicator extends MetaComponent {

	constructor () {
		super(global.storage);
	}

	render () {
		const content = Div();
		this.userIcon = content.Img();
		this.userName = content.Div();
		this.setUser();
		return content;
	}

	setUser () {
		const { players } = this.storage.getState().Match;
		Object.keys(players).forEach(_k => {
			const player = players[_k];
			if (player.isCzar) {
				this.userIcon.setAttribute("src", player.photoURL);
				this.userName.textContent = player.displayName;
			}
		})
	}

	handleStoreEvents () {
		return {
			'MATCH_UPDATE': (_) => {
				const { players } = this.storage.getState().Match;
				Object.keys(players).forEach(_k => {
					const player = players[_k];
					if (player.isCzar) {
						this.userIcon.setAttribute("src", player.photoURL);
						this.userName.textContent = player.displayName;
					}
				})
			}
		}
	}
}

window.customElements.define('czar-indicator', CzarIndicator);
