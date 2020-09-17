import '../containers/main-container';
import '../controllers';
console.log('main', process.env);
document.addEventListener('DOMContentLoaded', () => {
	const container = document.createElement('main-container');
	document.body.appendChild(container);
})
