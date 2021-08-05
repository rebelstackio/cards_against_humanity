import { MetaComponent, Div, H3 } from '@rebelstack-io/metaflux';
import '../czar-indicator';

class ScoreBoard extends MetaComponent {

	constructor () {
		super(global.storage);
	}

	render () {
		const { user: { photoURL } } = this.storage.getState().Main;
		this.scoreCounter = Div();
		this.avatar = Div({ className: 'avatar', style: `background-image: url(${photoURL});` })
		const content = Div(false, [
			Div({
				className: "board"
			}, Div(false, [
				H3(false, "My Score"),
				this.scoreCounter,
			])),
			this.avatar
		]);

		this.fillCounters();

		return content;
	}

	fillCounters () {
		const { user: { uid, photoURL } } = this.storage.getState().Main;
		const { players } = this.storage.getState().Match;
		const score = players[uid] ? players[uid].score : 0;
		this.scoreCounter.textContent = `Points  ${ score }`;
		this.avatar.style = `background-image: url(${photoURL});`;
	}

	handleStoreEvents () {
		return {
			'INCREASE_SELECTED_CARDS': _ => {
				this.fillCounters();
			},
			'DECREASE_SELECTED_CARDS': _ => {
				this.fillCounters();
			},
			'CANCEL_SELECTION': _ => {
				this.fillCounters();
			},
			'MATCH_UPDATE': () => {
				this.fillCounters();
			}
		};
	}
}

customElements.get("score-board") || customElements.define("score-board", ScoreBoard);
