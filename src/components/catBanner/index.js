import { Img, Div } from '@rebelstack-io/metaflux';
import catImage from  '../../css/images/mollejas.png'

function CardBanner () {
	return Div({
		className: 'cat-banner'
	}, [
		Img({src: catImage}),
		Div({
			className: 'button-group'
		}, [
			Div(false, "Draw!"),
			Div({
				onclick: () => {
					global.storage.dispatch({
						type: "CANCEL_SELECTION"
					});
				}
			}, "Cancel")
		])
	]).onStoreEvent('INCREASE_SELECTED_CARDS', (state, elem) => {
		const { selectedCards, selectedCardsLimit } = state.Main;
		if ( selectedCards >= selectedCardsLimit ) {
			elem.classList.add('open');
		}
	}).onStoreEvent('DECREASE_SELECTED_CARDS', (state, elem) => {
		const { selectedCards, selectedCardsLimit } = state.Main;
		if ( selectedCards < selectedCardsLimit ) {
			elem.classList.remove('open');
		}
	}).onStoreEvent('CANCEL_SELECTION', (state, elem) => {
		elem.classList.remove('open');
	});
}

export {
	CardBanner
}
