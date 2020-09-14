import { Div, H3, Img, Table, Tr, Td, Th } from '@rebelstack-io/metaflux';
import { UserHeader } from '../../components/UserHeader';
import { MatchsTable } from '../../components/MatchsTable';

const Lobby = () => Div({
	className: 'main-lobby'
}, [
	UserHeader,
	MatchsTable
]);

export {
	Lobby
}
