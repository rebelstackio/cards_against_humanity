import { MetaComponent, Div } from '@rebelstack-io/metaflux';

class CzarIndicator extends MetaComponent {

	constructor () {
		super(global.storage);
	}

	render () {
		const content = Div();
		this.userIcon = content.Img();
		const textContent = content.Div();
		textContent.H3(false, 'CZAR');
		this.userName = textContent.Span();
		this.setUser();
		return content;
	}

	setUser () {
		const { players } = this.storage.getState().Match;
		Object.keys(players).forEach(_k => {
			const player = players[_k];
			if (player.isCzar) {
				this.userIcon.setAttribute("src", player.photoURL);
				this.userName.textContent = player.displayName.split(' ')[0].toUpperCase();
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
						this.userName.textContent = player.displayName.split(' ')[0].toUpperCase();
					}
				})
			}
		}
	}
}

window.customElements.define('czar-indicator', CzarIndicator);
