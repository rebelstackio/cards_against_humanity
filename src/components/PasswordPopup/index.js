import { Input, Div, H3, Button } from '@rebelstack-io/metaflux'

class passwordPopup {
	constructor () {
		this.init()
		this.onSubmit = this.onSubmit.bind(this);
	}

	open() {
		this.content.classList.remove('hidden');
	}

	close() {
		this.content.classList.add('hidden');
	}

	init() {
		this.inp = Input({ type: 'password', placheholder: 'Match password'});
		this.btn = Button({ className: 'btn black'}, 'Go!')
		this.content = Div({ className: 'password-wrapper hidden' },
			Div({}, [
				H3({}, 'Password'),
				this.inp,
				this.btn
			])
		);
	}
	/**
	 * Handler for password submits
	 * @param {CallableFunction} next
	 */
	onSubmit (next) {
		this.btn.addEventListener('click', () => {
			next(this.inp.value)
		});
	}
}

export { passwordPopup }
