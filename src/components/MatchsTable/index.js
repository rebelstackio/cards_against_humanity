import { Tr, Td, Th, Div } from '@rebelstack-io/metaflux';

const { matchList } = global.storage.getState().Main;
const list = matchList.map((_m) => {
		return Tr({}, [
			Td({}, _m.name),
			Td({}, _m.owner),
			Td({}, _m.people),
			Td({}, _m.havePass ? 'YES' : 'NO')
		])
});

const MatchsTable = Div({className: 'table-wrapper'}).Table({ className: 'match-table' },[
	Tr({}, [
		Th({}, 'Name'),
		Th({}, 'Owner'),
		Th({}, 'People'),
		Th({}, 'Have Password')
	]),
	...list
]).baseNode();


export { MatchsTable }
