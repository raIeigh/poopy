module.exports = {
  name: ['ronald', 'ronaldgif'],
  args: [],
  execute: async function (msg) {
    let poopy = this

    await msg.reply(poopy.special.keys._ronald.func.call(poopy)).catch(() => { })
  },
  help: {
    name: 'ronald/ronaldgif',
    value: 'Sends a random Ronald McDonald GIF to the channel.'
  },
  cooldown: 2500,
  type: 'Random'
}