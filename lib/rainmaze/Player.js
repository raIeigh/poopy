const { TILE, STATE, VEC } = require('./defs')

//class Aud extends Audio {
//	play() {
//		this.currentTime = 0;
//		super.play();
//	}
//}
//
//const snd_flavor = new Aud('sounds/snd_bell.wav');
//snd_flavor.volume = 0.8;
//const snd_pirahnas = new Aud('sounds/snd_b.wav');
//snd_pirahnas.volume = 0.7;
//const snd_green = new Aud('sounds/mus_mt_yeah.wav');
//snd_green.volume = 0.12;
//const snd_shock = new Aud('sounds/snd_shock.wav');
//snd_shock.volume = 0.5;
//const snd_victory = new Aud('sounds/snd_dumbvictory.wav');

class Player {
	constructor(maze) {
		this.maze = maze;
		this.x = 0;
		this.y = maze.startY || 0;
		this.score = 0;
		this.state = STATE.NEUTRAL;
	}

	move(vec) {
		let x2 = this.x + vec.x;
		let y2 = this.y + vec.y;

		if (x2<0 || x2>=this.maze.width || y2<0 || y2>=this.maze.height)
			return;

		switch (this.maze[x2][y2]) {
			case TILE.ORANGE:
				//if (this.state != STATE.ORANGES)
					//snd_flavor.play();
				this.state = STATE.ORANGES;
			case TILE.PINK:
				this.x = x2;
				this.y = y2;
				break;

			case TILE.PURPLE:
				//if (this.state != STATE.LEMONS)
					//snd_flavor.play();
				this.state = STATE.LEMONS;
				this.x = x2;
				this.y = y2;
				this.move(vec);
				break;

			case TILE.GREEN:
				this.score++;
				this.x = x2;
				this.y = y2;
				//snd_green.play();
				break;

			case TILE.BLUE:
				if (this.state != STATE.ORANGES) {
					this.x = x2;
					this.y = y2;
					break;
				}
				else {
					this.x = x2;
					this.y = y2;
					//snd_pirahnas.play();
					this.move(VEC.reverse(vec));
					break;
				}
			case TILE.YELLOW:
			case TILE.ELEC:
				this.x = x2;
				this.y = y2;
				//snd_shock.play();
				this.move(VEC.reverse(vec));
				break;

			case TILE.PLAID:
				this.x = x2;
				this.y = y2;
				if (this.x != 0) {
					//snd_victory.play();
					this.state = STATE.VICTORY;
				}
				break;

			case TILE.NONE:
			case TILE.RED:
			default:
				return;
		}
	}
}

module.exports = Player