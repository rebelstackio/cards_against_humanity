import { Div, Span, H3, Img} from '@rebelstack-io/metaflux';

const WaitingRoom = () => Div({
	className: 'waiting-room'
}, [
	PlayerSideBar()
]);

const PlayerSideBar = () => Div({
	className: 'sidebar'
}, [
	H3({}, 'The People'),
	..._getThePeople()
]);

function _getThePeople() {
	const { match } = global.storage.getState().Main;
	return Object.keys(match.players).map(_uid => {
		const pl = match.players[_uid];
		return Div({className: 'player-box'}, [
			Img({src: pl.photoURL}),
			Span({}, pl.displayName),
			match.id === _uid ? Span({className: 'fas fa-crown'}) : ''
		])
	})
}

export {
	WaitingRoom
}
