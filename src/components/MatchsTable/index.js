import { Tr, Td, Th, Div, Img, H3 } from '@rebelstack-io/metaflux';
import emptyStateImg from '../../css/images/empty_list.svg';

const _store = global.storage;

function _getList() {
	const { matchList } = _store.getState().Main;
	if(_isEmpty(matchList)) return _getEmptyState();
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

function _isEmpty(obj) {
	return JSON.stringify(obj) === JSON.stringify({})
}

function _getEmptyState() {
	const { uid } = _store.getState().Main.user;
	return [
		Div({className: 'empty-state'},[
			Img({src: emptyStateImg}),
			H3({}, !uid ? 'Need to login to enter a match' : 'No active matchs, create One')
		])
	]
}

let tableHeader = Tr({}, [
	Th({}, 'Name'),
	Th({}, 'Owner'),
	Th({}, 'People'),
	Th({}, 'Have Password')
]);

const MatchsTable =
() => (
	Div({className: 'table-wrapper'}).Table({ className: 'match-table' },[
		tableHeader,
		..._getList()
	]).onStoreEvent('ROOMS_LIST', (_, that) => {
		console.log(that)
		that.innerHTML = '';
		that.append(tableHeader, ..._getList());
	}).baseNode()
);

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
