import { Tr, Td, Th, Div } from '@rebelstack-io/metaflux';

const { matchList } = global.storage.getState().Main;
const list = matchList.map((_m) => {
		return Tr({onclick: () => { requestToJoin(_m) }}, [
			Td({}, _m.name),
			Td({}, _m.owner),
			Td({}, _m.people),
			Td({}, _m.havePass ? 'YES' : 'NO')
		])
});

const MatchsTable =
() => (
	Div({className: 'table-wrapper'}).Table({ className: 'match-table' },[
		Tr({}, [
			Th({}, 'Name'),
			Th({}, 'Owner'),
			Th({}, 'People'),
			Th({}, 'Have Password')
		]),
		...list
	]).baseNode()
);

function requestToJoin(match) {
	global.storage.dispatch({ type: 'LOADING_ON', msg: `Joining to ${ match.name }`});
	//TODO: Call API
	setTimeout(() => {
		global.storage.dispatch({ type: 'LOADING_OFF' });
		global.router.go("game");
		//global.storage.dispatch({ type: 'JOIN_GAME', data: match })
	},2000)
}

export { MatchsTable }
