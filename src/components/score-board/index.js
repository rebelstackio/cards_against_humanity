import { MetaComponent, Div, H2 } from '@rebelstack-io/metaflux';
import '../czar-indicator';

class ScoreBoard extends MetaComponent {

	constructor () {
		super(global.storage);
	}

	render () {
		this.scoreCounter = document.createElement("div");
		const content = Div(false, [
			Div({
				className: "board"
			}, Div(false, [
				H2(false, "My Score:"),
				this.scoreCounter,
				//HTMLElementCreator("czar-indicator", {})
			]))
		]);

		this.fillCounters();

		return content;
	}

	fillCounters () {
		const { user: { uid } } = this.storage.getState().Main;
		const { players } = this.storage.getState().Match;
		const score = players[uid] ? players[uid].score : 0;
		this.scoreCounter.textContent = `Points: ${ score }`;
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
