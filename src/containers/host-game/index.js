import { Div } from '@rebelstack-io/metaflux';
import { UserHeader } from '../../components/UserHeader';
import { CreationMenu } from '../../components/CreationMenu';

const Host = () => Div({
	className: 'main-lobby host'
}, [
	UserHeader(),
	CreationMenu(),
]);

export {
	Host
}
