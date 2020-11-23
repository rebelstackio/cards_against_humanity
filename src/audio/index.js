import selectAudio from '../assets/audios/select_card.mp3';
import pickAudio from '../assets/audios/pick_card.mp3';
import notAuido from '../assets/audios/not.mp3';

class GameSounds {
	constructor () {
	}

	Play(type) {
		let s;
		switch (type) {
			case 'SELECT':
				s = selectAudio;
				break;
			case 'PICK':
				s = pickAudio;
				break;
			default:
				s = notAuido
				break;
		}
		let audio = new Audio(s);
		audio.play();
	}
}

export { GameSounds };
