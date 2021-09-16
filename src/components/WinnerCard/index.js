import { Div } from '@rebelstack-io/metaflux';
import { BlackPreview } from '../BlackPreview';


const WinnerCard = (props) => {
	console.log(props);
	const { fullText, pl } = props;
	return Div({ className: 'winner-box' },
		Div({ className: 'submits-wrapper winner-card' }, () => {
				return BlackPreview(fullText, false, true, { pl })
		})
	)
}

export { WinnerCard }
