module.exports = {
  name: ['pspasta', 'phexoniastudiospasta'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let arrays = poopy.arrays

    let psPasta = arrays.psPasta[Math.floor(Math.random() * arrays.psPasta.length)]
    if (!msg.nosend) await msg.reply(psPasta).catch(() => { })
    return psPasta
  },
  help: {
    name: 'pspasta/phexoniastudiospasta',
    value: 'Sends a random Phexonia Studios related copypasta or phrase to the channel.'
  },
  cooldown: 2500,
  type: 'Inside Joke'
}