import { Div, Span, H3 } from '@rebelstack-io/metaflux';
import { UserHeader } from '../../components/UserHeader';
import { MatchsTable } from '../../components/MatchsTable';
import { CreationMenu } from '../../components/CreationMenu';
import { LoadignModal } from '../../components/LoadingModal';

const Lobby = () => Div({
	className: 'main-lobby'
}, [
	UserHeader(),
	MatchsTable(),
	CreationMenu(),
	LoadignModal()
]);

export {
	Lobby
}
