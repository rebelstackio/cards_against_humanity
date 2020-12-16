import selectAudio from '../assets/audios/select_card.mp3';
import pickAudio from '../assets/audios/pick_card.mp3';
import notAudio from '../assets/audios/not.mp3';

class GameSounds {
	constructor () {
		this.selectAudio = new Audio(selectAudio);
		this.pickAudio = new Audio(pickAudio);
		this.notAudio = new Audio(notAudio);
	}

	Play(type) {
		let s;
		switch (type) {
			case 'SELECT':
				this.selectAudio.play();
				break;
			case 'PICK':
				this.pickAudio.play();
				break;
			default:
				this.notAudio.play();
				break;
		}
	}

}

export { GameSounds };
