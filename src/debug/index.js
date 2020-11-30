class DebugCounter {
	constructor () {

	}
	count(type) {
		let ls = localStorage.getItem('_d-'+type)
		if (ls !== null) {
			ls = parseInt(ls) + 1;
		} else {
			ls = 1;
		}
		localStorage.setItem('_d-' + type, ls);
	}
	clearAll() {
		const all = this.getAll()
		all.forEach(el => {
			localStorage.removeItem(el.key)
		})
	}
	getAll() {
		let i = localStorage.length;
		let all = [];
		while ( i-- ) {
			const key = localStorage.key(i)
			const value = localStorage.getItem(key);
			if (key.match(/(_d-)/g) !== null) {
				all.push({ key, value })
			}
		}
		return all
	}
	getCount(type) {
		return { key: type, value: parseInt(localStorage.getItem('_d-' + type)) }
	}
}

export { DebugCounter }
