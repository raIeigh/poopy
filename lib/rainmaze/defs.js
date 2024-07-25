const TILE = {
	NONE:	0,
	PINK:	1,
	ORANGE:	2,
	PURPLE:	3,
	GREEN:	4,
	BLUE:	5,
	YELLOW:	6,
	RED:	7,
	PLAID:	8,	// Start tile
	ELEC:	9,	// Electrified blue tile
	END:	10,	// End tile
};
const COLOR = ['⬛','⬜','🟧','🟪','🟩','🟦','🟨','🟥','🟫','🟦','🟠'];
const STATE = {
	NEUTRAL:0,
	ORANGES:1,
	LEMONS: 2,
	VICTORY:3
}
const VEC = {
	UP:	{x:0,y:-1},
	RIGHT:	{x:1,y:0},
	DOWN:	{x:0,y:1},
	LEFT:	{x:-1,y:0},
	reverse: vec => ({x:-1*vec.x, y:-1*vec.y})
};

function randInt(n) { return Math.floor(Math.random() * n); }

module.exports = { TILE, COLOR, STATE, VEC, randInt }