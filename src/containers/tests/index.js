import { Div,HTMLElementCreator } from '@rebelstack-io/metaflux';
import '../../components/test';

const Tests = () => Div({
	className: 'random'
}, [
	HTMLElementCreator('test-suit', {})
]);

export {
	Tests
}
