import { Div } from '@rebelstack-io/metaflux';
import { UserHeader } from '../../components/UserHeader';
import { MatchsTable } from '../../components/MatchsTable';
import { LoadignModal } from '../../components/LoadingModal';

const FindGame = () => Div({
	className: 'main-lobby find'
}, [
	UserHeader(true),
	MatchsTable(),
	LoadignModal()
]);

export {
	FindGame
}
