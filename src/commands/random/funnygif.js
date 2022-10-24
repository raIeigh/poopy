module.exports = {
  name: ['funnygif', 'memegif'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let special = poopy.special

    let funny = special.keys._funnygif.func.call(poopy)
    if (!msg.nosend) await msg.reply(funny).catch(() => { })
    return funny
  },
  help: {
    name: 'funnygif/memegif',
    value: 'Sends a random funny GIF to the channel.'
  },
  cooldown: 2500,
  type: 'Random'
}