import { Div, HTMLElementCreator } from '@rebelstack-io/metaflux';
import '../../components/hand';
import '../../components/czar';
import '../../components/popup';
import { CardBanner } from '../../components/catBanner';
import { SubmitPopUp } from '../../components/SubmitsPopUp';

const TableTop = () => Div({
	className: 'table-top'
}, [
	CardBanner(),
	HTMLElementCreator('cah-czar', {}),
	HTMLElementCreator('cah-hand', {}),
	HTMLElementCreator('cah-popup', {
		className: 'hidden'
	}),
	SubmitPopUp()
]);

export {
	TableTop
}
