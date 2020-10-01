import { MetaComponent, Div } from '@rebelstack-io/metaflux';

class TestSuit extends MetaComponent {
	constructor () {
		super(global.storage);
	}

	render () {
		return Div();
	}

	handleStoreEvents () {

	}
}

window.customElements.define('test-suit', TestSuit);

