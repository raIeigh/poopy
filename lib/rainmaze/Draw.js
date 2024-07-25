const { COLOR, STATE } = require('./defs')

function draw(maze, player, time) {
    let mazearr = []

    for (let y = 0; y < maze.height; y++) {
        let row = []
        for (let x = 0; x < maze.width; x++) {
            row.push(COLOR[maze[x][y]])
        }
        mazearr.push(row)
    }

    mazearr[player.y][player.x] = '❤️'

    let fields = []

    let flavorboard;
    switch (player.state) {
        case STATE.NEUTRAL:
        default:
            flavorboard = '⬛';
            break;

        case STATE.ORANGES:
            flavorboard = '🍊';
            break;

        case STATE.LEMONS:
            flavorboard = '🍋';
            break;

        case STATE.VICTORY:
            flavorboard = '🏆';
            break;
    }

    fields.push({
        name: 'Flavor',
        value: flavorboard,
        inline: true
    })

    fields.push({
        name: 'Score',
        value: player.score > 999 ? '🐕' : String(player.score),
        inline: true
    })

    let delta = Date.now() - time;

    if (delta >= 600000)	// >10 minutes
        fields.push({
            name: 'Time',
            value: 'sucks'
        })
    else {
        let min = Math.floor(delta / 1000 / 60);
        let sec = Math.floor(delta / 1000) % 60;
        let dec = Math.floor(delta / 100) % 10;

        fields.push({
            name: 'Time',
            value: `${min}:${sec}.${dec}`,
            inline: true
        })
    }

    return {
        title: 'Rainmaze',
        description: mazearr.map(row => row.join('')).join('\n'),
        color: 0xDD2E44,
        fields
    }
}

module.exports = draw