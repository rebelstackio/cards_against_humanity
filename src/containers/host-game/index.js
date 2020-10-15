import { Div } from '@rebelstack-io/metaflux';
import { UserHeader } from '../../components/UserHeader';
import { CreationMenu } from '../../components/CreationMenu';
import { LoadignModal } from '../../components/LoadingModal';

const Host = () => Div({
	className: 'main-lobby host'
}, [
	UserHeader(),
	CreationMenu(),
	LoadignModal()
]);

export {
	Host
}
