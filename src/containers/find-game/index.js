import { Div } from '@rebelstack-io/metaflux';
import { UserHeader } from '../../components/UserHeader';
import { MatchsTable } from '../../components/MatchsTable';

const FindGame = () => Div({
	className: 'main-lobby find'
}, [
	UserHeader(true),
	MatchsTable(),
]);

export {
	FindGame
}
