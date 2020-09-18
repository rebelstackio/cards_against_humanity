import { Tr, Td, Th, Div, Img, H3 } from '@rebelstack-io/metaflux';
import emptyStateImg from '../../css/images/empty_list.svg';

const _store = global.storage;

function _getList() {
	const { matchList } = _store.getState().Main;
	if(matchList.length === 0) return _getEmptyState();
	return Object.keys(matchList).map((_k) => {
			const _m = matchList[_k];
			return Tr({onclick: () => { requestToJoin(_m) }}, [
				Td({}, _m.name),
				Td({}, _m.owner),
				Td({}, _m.people),
				Td({}, _m.havePass ? 'YES' : 'NO')
			])
	});
}

function _getEmptyState() {
	return [
		Div({className: 'empty-state'},[
			Img({src: emptyStateImg}),
			H3({}, 'Need to login to enter a match')
		])
	]
}

let tableContent = _getList()

const MatchsTable =
() => (
	Div({className: 'table-wrapper'}).Table({ className: 'match-table' },[
		Tr({}, [
			Th({}, 'Name'),
			Th({}, 'Owner'),
			Th({}, 'People'),
			Th({}, 'Have Password')
		]),
		...tableContent
	]).baseNode()
);

_store.on('ROOMS_LIST', () => {
	tableContent = _getList()
})

function requestToJoin(match) {
	_store.dispatch({ type: 'LOADING_ON', msg: `Joining to ${ match.name }`});
	//TODO: Call API
	setTimeout(() => {
		_store.storage.dispatch({ type: 'LOADING_OFF' });
		global.router.go("game");
		//global.storage.dispatch({ type: 'JOIN_GAME', data: match })
	},2000)
}

export { MatchsTable }
