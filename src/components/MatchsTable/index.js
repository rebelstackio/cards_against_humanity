import { Tr, Td, Th, Div, Img, H3 } from '@rebelstack-io/metaflux';
import RoomApi from '../../lib/backend/firebase/room';
import emptyStateImg from '../../css/images/empty_list.svg';

const _store = global.storage;
/**
 * Get list from storage
 */
function _getList() {
	const { matchList } = _store.getState().Main;
	if(_isEmpty(matchList)) return _getEmptyState();
	return Object.keys(matchList).map((_k) => {
			const _m = matchList[_k];
			return Tr({onclick: () => { requestToJoin(_m, _k) }}, [
				Td({}, _m.name),
				Td({}, _m.createdBy.displayName),
				Td({}, `${_m.nplayers}/${_m.size}`),
				Td({}, _m.password ? 'YES' : 'NO')
			])
	});
}
/**
 * compare if object is empty
 * @param {Objec} obj
 */
function _isEmpty(obj) {
	return JSON.stringify(obj) === JSON.stringify({})
}
/**
 * Get styled emprty content
 */
function _getEmptyState() {
	const { uid } = _store.getState().Main.user;
	return [
		Div({className: 'empty-state'},[
			Img({src: emptyStateImg}),
			H3({}, !uid ? 'Need to login to enter a match' : 'No active matchs, create One')
		])
	]
}
/**
 * Table header
 */
let tableHeader = Tr({}, [
	Th({}, 'Name'),
	Th({}, 'Owner'),
	Th({}, 'People'),
	Th({}, 'Have Password')
]);
/**
 * Match Table component
 */
const MatchsTable =
() => {
	_getMatchs();
	return Div({className: 'table-wrapper'}).Table({ className: 'match-table' },[
		tableHeader,
		..._getList()
	]).onStoreEvent('ROOMS_LIST', (_, that) => {
		that.innerHTML = '';
		that.append(tableHeader, ..._getList());
	}).onStoreEvent('SEARCH_GAME', (state) => {
		const val = state.Main.searchValue;
		_searchMatch(val)
	})
	.onStoreEvent('CLEAR_SEARCH', () => { _getMatchs() })
	.baseNode()
};
/**
 * Handle search matchs && call search API
 * @param {String} val Search value
 */
function _searchMatch(val) {
	RoomApi.searchRoom(val).then((docSnap) => {
		let list = {}
		docSnap.docs.forEach(d => {
			console.log(d.id, d.data())
			list[d.id] = d.data();
		})
		_store.dispatch({ type: 'ROOMS_LIST', list })
	})
}
/**
 * request matchs from API
 */
function _getMatchs() {
	_store.dispatch({ type: 'LOADING_ON', msg: 'LOADING MATCHES' })
	RoomApi.listRooms().then((documentSnapshots) => {
			let list = {}
			documentSnapshots.docs.forEach(d => {
				list[d.id] = d.data();
			});
			_store.dispatch({ type: 'ROOMS_LIST', list})
			_store.dispatch({ type: 'LOADING_OFF' })
		}).catch((err) => {
			console.error('error', err);
		});
}
/**
 * Request to Join Room
 * @param {Object} match
 */
function requestToJoin(match, id) {
	_store.dispatch({ type: 'LOADING_ON', msg: `Joining to ${ match.name }`});
	//TODO: Call API
	setTimeout(() => {
		_store.dispatch({ type: 'LOADING_OFF' });
		global.router.go(`/waiting_room/${id}`);
		//global.storage.dispatch({ type: 'JOIN_GAME', data: match })
	},2000)
}

export { MatchsTable }
