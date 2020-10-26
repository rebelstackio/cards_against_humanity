import DeckApi from '../lib/backend/firebase/deck';

const getDeck = async function _getDeck(id) {
	const ls = localStorage.getItem(`d_${id}`);
	let res;
	if (ls === null) {
		const doc = await DeckApi.getDeck(id)
		res = doc.data();
		localStorage.setItem(`d_${id}`, JSON.stringify(res));
	} else {
		res = JSON.parse(ls);
	}
	return res;
}

export {
	getDeck
}
