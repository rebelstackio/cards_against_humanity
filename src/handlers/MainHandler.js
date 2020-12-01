/*
* DEFAULT HANDLER
*/
const MainDefaultState = {
	matchList: {},
	user: {},
	searchValue: '',
	isAuth: false,
	confirmation: {}
};

const MatchDefaultState = {
	id: '',
	players: { },
	isCzar: false,
	hand: '',
	selectedCards: 0,
	selectedCardsLimit: 2,
	awesomePoints: 0,
	selectedCardIds: [],
	czarCard: '',
	usedDeck: { whiteCards: [], blackCards: {} },
	rounds: [],
	status: 'W'
}
export default {
	MainDefaultState,
	MatchDefaultState,
	MainHandler: {
		'INCREASE_SELECTED_CARDS': (action, state) => {
			const { id } = action;
			state.Match.selectedCards += 1;
			state.Match.selectedCardIds.push(id);
			return { newState: state };
		},
		'DECREASE_SELECTED_CARDS': (action, state) => {
			const { id } = action;
			state.Match.selectedCards -= 1;
			state.Match.selectedCardIds = state.Match.selectedCardIds.filter(_id => _id !== id);
			return { newState: state };
		},
		'CANCEL_SELECTION': (_, state) => {
			state.Match.selectedCards = 0;
			state.Match.selectedCardIds = [];
			return { newState: state };
		},
		'AUTH_CHANGE': (action, state) => {
			state.Main.user = action.user;
			state.Main.isAuth = action.user.uid !== undefined;
			return { newState: state }
		},
		'ROOMS_LIST': (action, state) => {
			state.Main.matchList = action.list;
			return { newState: state }
		},
		'DISPLAY_NOTIFICATION': (action, state) => {
			state.Main.notificationMessage = action.msg;
			state.Main.notificationIcon = action.icon;
			state.Main.notificationAction = action.action;
			return { newState: state }
		},
		'DISPLAY_CONFIRMATION': (action, state) => {
			state.Main.confirmation = action.data;
			return { newState: state }
		},
		'SEARCH_GAME': (action, state) => {
			state.Main.searchValue = action.data
			return { newState: state }
		},
		'CLEAR_SEARCH': (action, state) => {
			state.Main.searchValue = '';
			return { newState: state }
		},
		'MATCH_CREATED': (action, state) => {
			const { data } = action;
			state.Match.isHost = true;
			state.Match = Object.assign({}, state.Match, data)
			return { newState: state }
		},
		'MATCH_UPDATE': updateEvent,
		'MATCH_JOINED': (action, state) => {
			const { id } = action
			state.Match.id = id;
			return { newState: state }
		},
		'LEAVE_ROOM': (_, state) => {
			localStorage.removeItem('m_joined');
			global.router.go('/lobby/host/');
			location.reload();
			return { newState: state }
		}
	}
};

function updateEvent (action, state) {
	const { data } = action;
	const { uid } = state.Main.user
	// Set isHost boolean
	state.Match.isHost = data.id === uid;
	// merge the current state with fb response
	state.Match = Object.assign({}, state.Match, data)
	// get the used deck
	state.Match.usedDeck = action.deck;
	if(state.Match.hand !== state.Match.players[uid].hand) {
		state.Match.hand = state.Match.players[uid].hand;
	}
	state.Match.isCzar = state.Match.players[uid].isCzar;
	if (state.Match.czarCard) {
		const bc = state.Match.usedDeck.blackCards[parseInt(state.Match.czarCard)];
		state.Match.selectedCardsLimit = bc.pick;
	}
	return { newState: state }
}
