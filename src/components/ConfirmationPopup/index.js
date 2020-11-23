import { Div, H3, Button } from '@rebelstack-io/metaflux';

const ConfirmationPopUp = () => Div({ className: 'confimation-wrapper hidden' })
.onStoreEvent('DISPLAY_CONFIRMATION', (state, that) => {
	const { confirmation } = state.Main;
	const { text, submit, cancel } = confirmation;
	that.innerHTML = '';
	that.append(
		Div({}, [
			H3({}, text),
			Div({ className: 'popup-actions' }, () => {
				let subBtn = Button({ onclick: _toggle, className: 'btn black'}, 'OK')
				let cancBtn = false
				if (submit) {
					subBtn = Button({ className: 'btn black', onclick: submit.handler }, submit.text)
				}
				if (cancel) {
					cancBtn = Button({ className: 'btn black', onclick: cancel.handler }, cancel.text)
				}
				return [cancBtn, subBtn];
			})
		])
	)
	that.classList.remove('hidden')
})
/**
 * toggle hidden, default action if not set by props
 */
function _toggle() {
	const parent = this.parentElement.parentElement;
	parent.classList.toggle('hidden')
}

export { ConfirmationPopUp }
