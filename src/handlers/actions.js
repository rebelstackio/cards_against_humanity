/**
 *
 * @param {String} act
 * @param {*} props
 */
const _dispatch = (act, props = {}) => {
	if (props.type) throw new TypeError('Actions Error: Property type is restricted and would override the dispatch');
	global.storage.dispatch(Object.assign({}, { type: act }, props))
}

export default {
	roomsList: (props) => {
		_dispatch('ROOMS_LIST', props)
	},
	loadingOn: (props) => {
		_dispatch('LOADING_ON', props)
	},
	loadingOff: () => {
		_dispatch('LOADING_OFF')
	},
	displayNotification: (props) => {
		_dispatch('DISPLAY_NOTIFICATION', props)
	},
	roomCreated: (props) => {
		_dispatch('MATCH_CREATED', props)
	},
	roomUpdate: (props) => {
		_dispatch('MATCH_UPDATE', props)
	},
	roomJoined: (props) => {
		_dispatch('MATCH_JOINED', props)
	},
	closePopUp: () => {
		_dispatch('CLOSE_POPUP');
	},
	cancelSelection: () => {
		_dispatch('CANCEL_SELECTION');
	},
	leaveRoom: () => {
		_dispatch('LEAVE_ROOM')
	},
	displayConfirmation: (props) => {
		_dispatch('DISPLAY_CONFIRMATION', props)
	}
}
