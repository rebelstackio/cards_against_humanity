import { MetaComponent, Div, H2, HTMLElementCreator } from '@rebelstack-io/metaflux';
import '../corner-menu';
import '../czar-indicator';

class ScoreBoard extends MetaComponent {

	constructor () {
		super(global.storage);
	}

	render () {
		this.scoreCounter = document.createElement("div");

		this.pickedCardCounter = document.createElement("div");

		const content = Div(false, [
			HTMLElementCreator("corner-menu", {}),
			Div({
				className: "board"
			}, Div(false, [
				H2(false, "Your Score:"),
				H2(false, "Czar:"),
				this.scoreCounter,
				this.pickedCardCounter,
				HTMLElementCreator("czar-indicator", {})
			]))
		]);

		this.fillCounters();

		return content;
	}

	fillCounters () {
		const { selectedCards, selectedCardsLimit, awesomePoints, isCzar } = this.storage.getState().Main;
		this.scoreCounter.textContent = `Awesome Points: ${awesomePoints}`;
		this.pickedCardCounter.textContent = `Cards picked: ${selectedCards}/${selectedCardsLimit}`;
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
			}
		};
	}
}

customElements.get("score-board") || customElements.define("score-board", ScoreBoard);
