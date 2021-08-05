"use strict;"
import { Div, Span, HTMLElementCreator } from '@rebelstack-io/metaflux';
import img1 from '../../assets/img/cartas/basica/1.svg';
import img2 from '../../assets/img/cartas/basica/2.svg';
import img3 from '../../assets/img/cartas/basica/3.svg';
import img4 from '../../assets/img/cartas/basica/4.svg';
import img5 from '../../assets/img/cartas/basica/5.svg';
import img6 from '../../assets/img/cartas/basica/6.svg';
import img7 from '../../assets/img/cartas/basica/7.svg';
import img8 from '../../assets/img/cartas/basica/8.svg';
import img9 from '../../assets/img/cartas/basica/9.svg';
import img10 from '../../assets/img/cartas/basica/10.svg';

/**
 * Map backgroun img to index
 */
const imgMap = [ img1, img2, img3, img4, img5, img6, img7, img8, img9, img10 ];
/**
 * Card component
 * @param {string} content inner html content
 * @param {string} className black or white style of card
 * @param {string} id id of card
 */
function cahCard (content = "", className = "white", id = 0, index = 0) {
	const _gameSounds = global.gameSounds;
	this.id = id;// It's referenced from hand
	const _storage = global.storage;
	const card = HTMLElementCreator('cah-card', {
		className: className,
		id: `cah-card-${id}`,
		content: [Span(), Div(false, content)],
		style: `background: url(${imgMap[index]}) no-repeat; background-size: cover;`
	})
	if (className === 'white') {
		card.addEventListener('click', () => {
			const { selectedCards, selectedCardsLimit } = _storage.getState().Match;
			const isCardSelected = card.classList.contains('selected');
			if (!isCardSelected && selectedCards < selectedCardsLimit) {
				_gameSounds.Play('SELECT');
				card.classList.add('selected');
				_storage.dispatch({
					type: 'INCREASE_SELECTED_CARDS',
					id
				});
			} else if (isCardSelected) {
				_gameSounds.Play(/* default not sound */);
				card.classList.remove('selected');
				_storage.dispatch({
					type: 'DECREASE_SELECTED_CARDS',
					id
				});
			}
		});
	}

	return card;
}

export default cahCard;
