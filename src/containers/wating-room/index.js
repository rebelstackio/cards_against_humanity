import { Div } from '@rebelstack-io/metaflux';
import { PlayerSideBar } from '../../components/PlayerSideBar';
import { ChatArea } from '../../components/ChatArea';
import { Settings } from '../../components/Settings';

const _storage = global.storage;

_storage.dispatch({ type: 'LISTEN_CHAT' })

const WaitingRoom = () => Div({
	className: 'waiting-room'
}, [
	PlayerSideBar(),
	ChatArea(),
	...Settings()
]);


export {
	WaitingRoom
}
