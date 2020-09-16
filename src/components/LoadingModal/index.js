import { H3, Div, Span } from '@rebelstack-io/metaflux'

HTMLElement.prototype.storeEventWithAction = function (event, callback) {
	global.storage.on(event, callback);
	return this;
}

const LoadignModal = () => {
	const msg = H3({}, 'Loading Match');
	const wrapper = Div({ className: 'modal-wrapper hidden' },
	Div({ className: 'modal-body' }, [
		msg,
		Span({ className: 'modal-spinner' })
	]))
	return wrapper.storeEventWithAction('LOADING_ON', (action) => {
		if (action.msg) msg.innerHTML = action.msg;
		wrapper.classList.remove('hidden')
	}).storeEventWithAction('LOADING_OFF', () => {
		wrapper.classList.add('hidden')
	})
}

export { LoadignModal }
