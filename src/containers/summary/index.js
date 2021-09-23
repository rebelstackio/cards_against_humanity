import { Div, Span, Button, HTMLElementCreator } from '@rebelstack-io/metaflux';
import { BlackPreview } from '../../components/BlackPreview';
import { getFullText } from '../../util';
import RoomAPI from '../../lib/backend/firebase/room';
import HostApi from '../../lib/backend/firebase/host';
import Actions from '../../handlers/actions';
import '../../components/score-board';
import { CardScroller } from '../../components/CardScroller';

const _storage = global.storage;

const Summary = () => Div({ className: 'summary-box' }, () => {
	const { players, winningScore } = _storage.getState().Match;
	const winner = _getWinner(players, winningScore);
	if (!winner) return [];
	const content = _getWinnerContent(winner);
	return content
}).onStoreEvent('MATCH_UPDATE', (state, that) => {
	const { players, winningScore } = _storage.getState().Match;
	const winner = _getWinner(players, winningScore);
	that.innerHTML = '';
	if (!winner) return;
	const content = _getWinnerContent(winner);
	that.append(...content);
	_setListeners(that);
})

function _setListeners(content) {
	const body = content.querySelector('.rounds-played');
	const header = content.querySelector('.winner-wrapper');
	body.onscroll = () => {
		if (body.scrollTop > 0) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
	}
}

function _getWinnerContent(winner) {
	return [
		Div({ className:'winner-wrapper' }, [
			Div({className: 'winner-info'}, [
				Div({ className: 'avatar s-W', style: `background-image: url(${winner.photoURL});` }),
				Div({ className: 'winner-banner' }),
			]),
			HTMLElementCreator('score-board')
		]),
		Div({ className: 'rounds-played' }, _getPlayedRounds()),
		_getActions(),
	]
}

function _getPlayedRounds() {
	const { rounds, players } = _storage.getState().Match;
	return rounds.map((round, i) => {
		const winnerID = Object.keys(round.winner)[0]
		const photoURL = winnerID ? players[winnerID].photoURL : '';
		const data = _getRound(round)
		return Div({}, [
			Div({className:'round-header'},
				Div({},
					[
						Div({ className: 'avatar s-W', style: `background-image: url(${photoURL});` }),
						Span({}, `Winner of the Round ${ i + 1 }`),
					])
				),
			Div({ className: 'round-wrapper' }, CardScroller({ data }))
		])
	})
}

function _getRound(round) {
	const _dbc = _storage.getState().Match.usedDeck.blackCards;
	const { whiteCards, winner, czarCard } = round;
	return Object.keys(whiteCards).map(pid => {
		const selectedCards = whiteCards[pid];
		let fullText = getFullText(_dbc[czarCard].text, selectedCards);
		const pl = _storage.getState().Match.players[pid];
		return BlackPreview(fullText, false, true, { pl })
	})
}

function _getWinner(players, winningScore) {
	const pid = Object.keys(players);
	for (let i=0; i < pid.length; i++) {
		const player = players[pid[i]];
		if (player.score >= winningScore) {
			return player;
		}
	}
}

function _getActions () {
	const { isHost } = _storage.getState().Match;
	return Div({ className: 'summary-action' }, Button({
		onclick: isHost ? _startOver : _leaveMatch,
		className: 'btn-primary'
	},isHost ? 'Start Over' : 'Leave Match'))
}

function _startOver() {
	const { id, usedDeck } = _storage.getState().Match;
	HostApi.startOver(id, usedDeck)
	.then(() => {
		console.log('yeeeey start again');
		document.location.reload();
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
