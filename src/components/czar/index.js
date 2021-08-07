import { MetaComponent, Div, HTMLElementCreator, Span } from '@rebelstack-io/metaflux';
import '../score-board';

class Czar extends MetaComponent {
	constructor () {
		super(global.storage);
	}

	render () {
		const content = Div();

		this.blackCard = HTMLElementCreator('cah-card', { className: 'black' });

		this.selectedCards = Span({}, this.storage.getState().Match.selectedCards);
		this.selectedLimit = Div({}, '/' + this.storage.getState().Match.selectedCardsLimit);

		content.append(this.blackCard, this._getSelectCount());
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

	_getSelectCount() {
		return Div({ className: 'cards-counter' },
			Div({}, [
				this.selectedCards,
				this.selectedLimit
			])
		)
	}

	onSelectedCardsChange () {
		const newText = this.replaceBlanks();
		this.blackCard.innerHTML = `<div>${newText}</div>`;
	}

	updateContent () {
		const { usedDeck, czarCard, selectedCardsLimit, selectedCards } = this.storage.getState().Match;
		this.selectedLimit.innerHTML = '/' + selectedCardsLimit;
		this.selectedCards.innerHTML = selectedCards;
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
				const { selectedCards } = this.storage.getState().Match;
				this.selectedCards.innerHTML = selectedCards;
				this.onSelectedCardsChange();
			},
			'DECREASE_SELECTED_CARDS': _ => {
				const { selectedCards } = this.storage.getState().Match;
				this.selectedCards.innerHTML = selectedCards;
				this.onSelectedCardsChange();
			},
			'CANCEL_SELECTION': _ => {
				const { selectedCards } = this.storage.getState().Match;
				this.selectedCards.innerHTML = selectedCards;
				this.onSelectedCardsChange();
			},
			'MATCH_UPDATE': _ => {
				this.updateContent();
			}
		}
	}
}

window.customElements.define('cah-czar', Czar)
