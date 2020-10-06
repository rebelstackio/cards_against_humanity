import { Div, Span, Button } from '@rebelstack-io/metaflux';

const _storage = global.storage;

const _notMessage = Span();
const _notIcon = Span();
const _notAction = Button({}, 'Got it');

const SnackBar = () => Div({ className: 'snackbar hidden' }, {
	content: [
	_notIcon,
	_notMessage,
	_notAction
	],
	events: {
		'DISPLAY_NOTIFICATION': function (action) {
			console.log(action, this);
		}
	}
});

export { SnackBar }
