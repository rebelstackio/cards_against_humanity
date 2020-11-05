import { Div, H3, Img, Span } from '@rebelstack-io/metaflux';

const _storage = global.storage;

const ScoreInfo = () => Div({ className: 'score-info' },  () => {
	const { user: { uid, displayName, photoURL } } = _storage.getState().Main;
	const { players } = _storage.getState().Match;
	return [
		Div({}, [
			Img({ src: photoURL }),
			H3({}, displayName)
		]),
		Div({ className: 'score' }, [
			H3({}, 'Your Awesomes Points: '),
			Span({}, players[uid].score)
		])
	]
});

export { ScoreInfo }
