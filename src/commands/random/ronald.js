module.exports = {
  name: ['ronald', 'ronaldgif'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let special = poopy.special

    var ronald = special.keys._ronald()
    if (!msg.nosend) await msg.reply(ronald).catch(() => { })
    return ronald
  },
  help: {
    name: 'ronald/ronaldgif',
    value: 'Sends a random Ronald McDonald GIF to the channel.'
  },
  cooldown: 2500,
  type: 'Random'
}