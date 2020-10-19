import { Div, Span, Button } from '@rebelstack-io/metaflux';

const _TIMEOUT = 8000;
const _notMessage = Span();
const _notIcon = Span();
const _notAction = Button({ onclick: function () {
	this.parentElement.classList.add('hidden');
} }, 'Got it');

const SnackBar = () => Div({ className: 'snackbar hidden' }, [
	_notIcon,
	_notMessage,
	_notAction
]).onStoreEvent('DISPLAY_NOTIFICATION', (state, that) => {
	const { notificationMessage, notificationIcon, notificationAction } = state.Main;
	console.log(notificationMessage, notificationIcon, notificationAction);
	if(notificationMessage) {
		_notMessage.innerHTML = notificationMessage;
	}
	if (notificationIcon) {
		_notIcon.className = notificationIcon;
	}
	if (notificationAction) {
		const act = Object.keys(notificationAction)[0];
		_notAction.innerHTML = act;
		_notAction.onclick = notificationAction[act];
	}
	that.classList.remove('hidden');
	setTimeout(() => that.classList.add('hidden'), _TIMEOUT);
});

export { SnackBar }
