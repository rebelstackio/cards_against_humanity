import { Div, HTMLElementCreator, Span } from '@rebelstack-io/metaflux';
import '../../components/hand';
import '../../components/czar';
import '../../components/popup';
import { CardBanner } from '../../components/catBanner';
import { SubmitPopUp } from '../../components/SubmitsPopUp';
import { Settings } from '../../components/Settings';

const TableTop = () => Div({
	className: 'table-top'
}, [
	CardBanner(),
	HTMLElementCreator("czar-indicator", {}),
	HTMLElementCreator("score-board", {}),
	HTMLElementCreator('cah-czar'),
	HTMLElementCreator('cah-hand'),
	HTMLElementCreator('cah-popup', {
		className: 'hidden'
	}),
	SubmitPopUp(),
	Settings()
]);

export {
	TableTop
}
