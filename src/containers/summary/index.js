import { Div, H2, Img, Span, H1, Button } from '@rebelstack-io/metaflux';
import { PreviewSubmit } from '../../components/PreviewSubmit';
import { ScoreInfo } from '../../components/ScoreInfo';
import { getFullText } from '../../util';
import RoomAPI from '../../lib/backend/firebase/room';
import HostApi from '../../lib/backend/firebase/host';
import Actions from '../../handlers/actions';

const _storage = global.storage;

const Summary = () => Div({}, () => {
	const { players, winningScore } = _storage.getState().Match;
	const winner = _getWinner(players, winningScore);
	return [
		Div({ className:'winner-wrapper' }, [
			H1({}, 'The stupid Winner'),
			Img({ src: winner.photoURL, alt: 'winner-picture' }),
			H2({}, winner.displayName),
			ScoreInfo()
		]),
		Div({ className: 'rouns-played' }, _getPlayedRounds()),
		_getActions(),
	]
});

function _getPlayedRounds() {
	const { rounds, players } = _storage.getState().Match;
	return rounds.map((round, i) => {
		const winnerID = Object.keys(round.winner)[0]
		const name = winnerID ? players[winnerID].displayName : '';
		return Div({}, [
			Span({}, `Winner of the Round ${ i + 1 }: ${name}`),
			Div({ className: 'round-wrapper' }, _getRound(round))
		])
	})
}

function _getRound(round) {
	const _dbc = _storage.getState().Match.usedDeck.blackCards;
	const { whiteCards, winner, czarCard } = round;
	return Object.keys(whiteCards).map(pid => {
		const selectedCards = whiteCards[pid];
		let fullText = getFullText(_dbc[czarCard].text, selectedCards);
		return PreviewSubmit({
			fullText,
			isWinner: winner[pid] !== undefined
		})
	})
}

function _getWinner(players, winningScore) {
	const pids = Object.keys(players);
	for (let i=0; i < pids.length; i++) {
		const player = players[pids[i]];
		if (player.score >= winningScore) {
			return player;
		}
	}
}

function _getActions () {
	const { isHost } = _storage.getState().Match;
	return Div({ className: 'summary-action' }, Button({
		onclick: isHost ? _startOver : _leaveMatch,
		className: 'btn black'
	},isHost ? 'Start Over' : 'Leave Match'))
}

function _startOver() {
	const { id, usedDeck } = _storage.getState().Match;
	HostApi.startOver(id, usedDeck)
	.then(() => {
		console.log('yeeeey start again');
	})
}

function _leaveMatch() {
	const { id } = _storage.getState().Match;
	RoomAPI.leaveRoom(id)
	.then(() => {
		Actions.leaveRoom()
	})
}


export { Summary }
