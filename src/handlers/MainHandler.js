/*
* DEFAULT HANDLER
*/

const MainDefaultState = {
	selectedCards: 0,
	selectedCardsLimit: 2,
	awesomePoints: 0,
	isCzar: false,
	czarData: {
		iconUrl: false,
		username: 'Pablo'
	},
	hand: [
		"People with cake in their mouths talking about how good cake is.",
		"The Hawaiian goddess Kapo and her flying detachable vagina.",
		"Piece of shit Christmas cards with no money in them.",
		"A magical tablet containing a world of unlimited pornography.",
		"Finding out that Santa isn't real.",
		"The Grinch's musty, cum-stained pelt.",
		"Giving money and personal information to strangers on the Internet.",
		"The shittier, Jewish version of Christmas.",
		"Rudolph's bright red balls.",
		"Jizzing into Santa's beard."
	],
	selectedCardIds: [],
	czarCard: {
		text: "But wait, there's more! If you order _ in the next 15 minutes, we'll throw in _ absolutely free!",
		pick: 2
	},
	matchList: {},
	user: {},
	match: {
		id: '6nhvGCSvfnRJlHQMNHCMShbGbMW2',
		players: {
			'6nhvGCSvfnRJlHQMNHCMShbGbMW2': { displayName: 'Osmar Reyes', photoURL: 'https://lh6.googleusercontent.com/-TmLVSeQnjg8/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJO-bkkb7zSsQ_dhyIE_8NYlPTOpWg/photo.jpg' },
			'jdksdla': { displayName: 'Dummy 1', photoURL: 'https://lh6.googleusercontent.com/-TmLVSeQnjg8/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJO-bkkb7zSsQ_dhyIE_8NYlPTOpWg/photo.jpg' },
			'oereowi': { displayName: 'Dummy 2', photoURL: 'https://lh6.googleusercontent.com/-TmLVSeQnjg8/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJO-bkkb7zSsQ_dhyIE_8NYlPTOpWg/photo.jpg' }
		 }
	},
	searchValue: ''
};

export default {
	MainDefaultState,
	MainHandler: {
		'INCREASE_SELECTED_CARDS': (action, state) => {
			const { id } = action;
			state.Main.selectedCards += 1;
			state.Main.selectedCardIds.push(id);
			return { newState: state };
		},
		'DECREASE_SELECTED_CARDS': (action, state) => {
			const { id } = action;
			state.Main.selectedCards -= 1;
			state.Main.selectedCardIds = state.Main.selectedCardIds.filter(_id => _id !== id);
			return { newState: state };
		},
		'CANCEL_SELECTION': (_, state) => {
			state.Main.selectedCards = 0;
			state.Main.selectedCardIds = [];
			return { newState: state };
		},
		'AUTH_CHANGE': (action, state) => {
			state.Main.user = action.user;
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
		'SEARCH_GAME': (action, state) => {
			state.Main.searchValue = action.data
			return { newState: state }
		},
		'CLEAR_SEARCH': (action, state) => {
			state.Main.searchValue = '';
			return { newState: state }
		}
	}
};
