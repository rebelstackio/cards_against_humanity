import { MetaComponent } from '@rebelstack-io/metaflux';
import '../score-board';

class Czar extends MetaComponent {
	constructor () {
		super(global.storage);
	}

	render () {
		const content = document.createElement("div");

		this.blackCard = document.createElement("cah-card");
		this.blackCard.className = "black";

		const scoreBoard = document.createElement("score-board");

		content.append(this.blackCard);
		content.append(scoreBoard);
		this.updateContent();
		return content;
	}

	replaceBlanks () {
		const { czarCard, selectedCardIds, usedDeck } = this.storage.getState().Match;
		let { text } = usedDeck.blackCards[czarCard];
		for (let i = 0; i < selectedCardIds.length; i++) {
			text = text.replace(/___/, `<span>${i + 1}</span>`);
		}
		return text;
	}

	onSelectedCardsChange () {
		const newText = this.replaceBlanks();
		this.blackCard.innerHTML = `<div>${newText}</div>`;
	}

	updateContent () {
		const { usedDeck, czarCard } = this.storage.getState().Match;
		if(usedDeck.blackCards[czarCard]) {
			const { text } = usedDeck.blackCards[czarCard];
			this.blackCard.innerHTML = `<div>${text}</div>`;
		} else {
			this.blackCard.innerHTML = `<div></div>`;
		}
	}

	handleStoreEvents () {
		return {
			'INCREASE_SELECTED_CARDS': _ => {
				this.onSelectedCardsChange();
			},
			'DECREASE_SELECTED_CARDS': _ => {
				this.onSelectedCardsChange();
			},
			'CANCEL_SELECTION': _ => {
				this.onSelectedCardsChange();
			},
			'MATCH_UPDATE': _ => {
				global.debugCount.count('scoreboar-wrapper-ue')
				this.updateContent();
			}
		}
	}
}

window.customElements.define('cah-czar', Czar)
