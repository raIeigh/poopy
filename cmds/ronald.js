module.exports = {
  name: ['ronald', 'ronaldgif'],
  execute: async function (msg) {
    let poopy = this

    await msg.channel.send(await poopy.specialkeys.keys._ronald.func()).catch(() => { })
  },
  help: {
    name: 'ronald/ronaldgif',
    value: 'Sends a random Ronald McDonald GIF to the channel.'
  },
  cooldown: 2500,
  type: 'Random'
}