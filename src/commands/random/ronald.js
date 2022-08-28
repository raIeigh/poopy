module.exports = {
  name: ['ronald', 'ronaldgif'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let special = poopy.special

    await msg.reply(special.keys._ronald()).catch(() => { })
  },
  help: {
    name: 'ronald/ronaldgif',
    value: 'Sends a random Ronald McDonald GIF to the channel.'
  },
  cooldown: 2500,
  type: 'Random'
}