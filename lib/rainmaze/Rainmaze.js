// Edited version of CodeWeaver's Undertale Rainmaze (https://loganhall.net/rainmaze/play.html) to be used in Discord.JS

const { STATE, VEC } = require('./defs')
const Maze = require('./Maze')
const Player = require('./Player')
const draw = require('./Draw')

module.exports = class Rainmaze {
    constructor(w, h) {
        this.maze = Maze.random(w ?? 8, h ?? 6);
        this.player = new Player(this.maze);
        this.time = Date.now();
    }

    move(direction) {
        this.player.move(VEC[direction.toUpperCase()]);

        return draw(this.maze, this.player, this.time);
    }

    reset() {
        let s = this.player.score;
        this.player = new Player(this.maze);
        this.player.score = s;

        return draw(this.maze, this.player, this.time);
    }

    draw() {
        return draw(this.maze, this.player, this.time);
    }

    get won() { return this.player.state == STATE.VICTORY }
}