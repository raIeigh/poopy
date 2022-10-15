module.exports = {
  name: ['rainmaze', 'tilemaze'],
  args: [
    { "name": "w", "required": false, "specifarg": false, "orig": "[w (max 27)]" },
    { "name": "h", "required": false, "specifarg": false, "orig": "[h (max 7)]" }
  ],
  execute: async function (msg, args) {
    let poopy = this
    let { rainmaze, getIndexOption, parseNumber, getOption } = poopy.functions
    let { Rainmaze } = poopy.modules

    var nosend = getOption(args, 'nosend', { n: 0, splice: true, dft: false })
    var w = parseNumber(getIndexOption(args, 1, { dft: [8] })[0], { min: 2, max: 27, dft: 8, round: true })
    var h = parseNumber(getIndexOption(args, 2, { dft: [6] })[0], { min: 1, max: 7, dft: 6, round: true })

    await msg.channel.sendTyping().catch(() => { })
    if (nosend) return new Rainmaze(w, h).draw().description

    var rainstring = await rainmaze(msg.channel, msg.member, msg, w, h).catch(() => { })
    return rainstring
  },
  help: {
    name: '<:newpoopy:839191885310066729> rainmaze/tilemaze [w (max 27)] [h (max 7)]',
    value: "Play Undertale's tile puzzle minigame!"
  },
  cooldown: 5000,
  type: 'Unique'
}