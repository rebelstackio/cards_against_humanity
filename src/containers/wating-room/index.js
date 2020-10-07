import { Div } from '@rebelstack-io/metaflux';
import { PlayerSideBar } from '../../components/PlayerSideBar';
import { ChatArea } from '../../components/ChatArea';
import { SnackBar } from '../../components/SnackBar';

const _storage = global.storage;

_storage.dispatch({ type: 'LISTEN_CHAT' })

const WaitingRoom = () => Div({
	className: 'waiting-room'
}, [
	PlayerSideBar(),
	ChatArea(),
	SnackBar()
]);


export {
	WaitingRoom
}
