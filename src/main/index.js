import '../containers/main-container';
import '../controllers';
import Router from  '../router';

console.log('main', process.env);
document.addEventListener('DOMContentLoaded', () => {
	new Router().on(/.*/, () => {
		const container = document.createElement('main-container');
		document.body.appendChild(container);
	});
})
