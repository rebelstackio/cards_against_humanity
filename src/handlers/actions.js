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
	}
}