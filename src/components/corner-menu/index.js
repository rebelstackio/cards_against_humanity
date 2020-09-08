import { MetaComponent, Div, Span } from '@rebelstack-io/metaflux';

class Menu extends MetaComponent {
	constructor () {
		super( global.storage );
	}
	render () {
		return Div(false, [
			Div({
				onclick: e => {
					e.preventDefault()
					this.storage.dispatch({
						type: "OPEN_MODAL_SETTINGS"
					});
				}
			}, Span({
				className: "fa fa-cog"
			})),
			Div(false, Span({
				className: "fa fa-user"
			}))
		]);
	}
	handleStoreEvents () {
		return {
			'_': _ => {
				//
			}
		}
	}
}

window.customElements.define('corner-menu', Menu);