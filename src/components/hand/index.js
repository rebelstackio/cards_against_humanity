import { MetaComponent, Div } from '@rebelstack-io/metaflux';
import cahCard from '../../components/card';
import { ShuffleHand } from '../ShuffleHand';
import '../../handlers';

const UPDATE_EV = 'MATCH_UPDATE';

class Hand extends MetaComponent {
	constructor () {
		super(global.storage);
		this.hand = '';
	}
	render () {
		this.content = Div({});
		this.cards = [];
		this._getContent()
		return this.content
		.onStoreEvent(UPDATE_EV, (state) => {
			if (this.hand !== state.Match.hand) {
				console.log('#> update hand component');
				this._getContent();
			}
		})
	}

	_getContent() {
		this.hand = this.storage.getState().Match.hand;
		let hand = this.hand.split(',');
		const { whiteCards } = this.storage.getState().Match.usedDeck;
		this.content.innerHTML = '';
		for (let i = 0; i < hand.length; i++) {
			const cardNode = new cahCard(whiteCards[hand[i]], 'white', hand[i], i);
			this.cards.push(cardNode);
			this.content.appendChild(cardNode);
		}
		this.content.appendChild(ShuffleHand())
	}

	tagCard () {
		const { selectedCardIds } = this.storage.getState().Match;

		this.cards.forEach(card => {
			selectedCardIds.forEach((id, index) => {
				if (card.id === `cah-card-${id}`) {
					card.querySelector('span').textContent = index + 1;
					card.querySelector('span').className = `cah-card-count-${index +1}`;
				}
			})
		});
	}
	handleStoreEvents () {
		return {
			'INCREASE_SELECTED_CARDS': _ => {
				const { selectedCards, selectedCardsLimit } = this.storage.getState().Match;
				if (selectedCards === selectedCardsLimit) {
					this.content.classList.add('full-hand');
				} else {
					this.content.classList.remove('full-hand');
				}
				this.tagCard();
			},
			'DECREASE_SELECTED_CARDS': _ => {
				const { selectedCards, selectedCardsLimit } = this.storage.getState().Match;
				if (selectedCards < selectedCardsLimit) {
					this.content.classList.remove('full-hand');
				}
				this.tagCard();
			},
			'CANCEL_SELECTION': _ => {
				this.content.classList.remove('full-hand');
				this.cards.forEach(card => {
					card.classList.remove("selected");
				});
			}
		};
	}
}

window.customElements.define('cah-hand', Hand);
