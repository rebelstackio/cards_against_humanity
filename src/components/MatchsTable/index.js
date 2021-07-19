import { Tr, Td, Th, Div, Img, H3, Input, Button } from '@rebelstack-io/metaflux';
import RoomApi from '../../lib/backend/firebase/room';
import Actions from '../../handlers/actions';
import { passwordPopup } from '../PasswordPopup';

const _store = global.storage;
let popup = new passwordPopup();
/**
 * Get list from storage
 */
function _getList() {
	const { matchList } = _store.getState().Main;
	if(_isEmpty(matchList)) return _getEmptyState();
	return Object.keys(matchList).map((_k) => {
			const _m = matchList[_k];
			return Tr({onclick: () => {
					if (!_m.password) {
						requestToJoin(_k, false, _m)
					} else {
						popup.open()
						popup.onSubmit((passw) =>  {
							popup.close();
							requestToJoin(_k, passw, _m)
						})
					}
				}}, [
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
	let ret = [
		Div({className: 'empty-state'},[
			H3({}, !uid ? 'Need to login to enter a match' : 'No active matchs, create One')
		]),
		...getEmptyRows([])
	]
	return ret;
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
	return Div({className: 'table-wrapper'}, popup.content).Table({ className: 'match-table' },
	() => {
		_getMatchs()
		return [
			tableHeader,
			...getEmptyRows(_getList())
		]
	}).onStoreEvent('ROOMS_LIST', (_, that) => {
		that.innerHTML = '';
		that.append(tableHeader, ...getEmptyRows(_getList()));
	}).onStoreEvent('SEARCH_GAME', (state) => {
		const val = state.Main.searchValue;
		_searchMatch(val)
	})
	.onStoreEvent('CLEAR_SEARCH', () => { _getMatchs() })
	.onStoreEvent('AUTH_CHANGE', () => { _getMatchs() })
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
			list[d.id] = d.data();
		})
		Actions.roomsList({ list })
	})
}
/**
 * request matchs from API
 */
function _getMatchs() {
	Actions.loadingOn({msg: 'LOADING MATCHES'})
	const { isAuth } = _store.getState().Main;
	if ( isAuth ) {
		RoomApi.listRooms().then((documentSnapshots) => {
				let list = {}
				documentSnapshots.docs.forEach(d => {
					list[d.id] = d.data();
				});
				Actions.roomsList({ list });
				Actions.loadingOff();
			}).catch((err) => {
				console.error('error', err);
			});
	} else {
		Actions.roomsList({ list: {} });
		Actions.loadingOff();
	}
}
/**
 * Request to Join Room
 * @param {Object} match
 */
function requestToJoin(id, password, match) {
	console.log(id)
	Actions.loadingOn({ msg: `Joining to ${ match.name }` });
	RoomApi.joinRoom(id, password, (resp) => {
		if(resp.success) {
			localStorage.setItem('m_joined', id);
			Actions.roomJoined({ id, deck: match.deck })
		} else {
			Actions.displayNotification({ msg: resp.error, icon: 'fas fa-exclamation-triangle' })
		}
		Actions.loadingOff();
	})
}
/**
 * Refill with empty rows
 * @param {*} list
 * @returns
 */
function getEmptyRows(list) {
	if (list.length > 4) return list;
	for(let i =0; i < 4; i++) {
		if (list[i] === undefined) {
			list[i] = Tr({},[Td(), Td(), Td(), Td()]);
		}
	}
	return list;
}

export { MatchsTable }
