module.exports = {
  name: ['pspasta', 'phexoniastudiospasta'],
  execute: async function (msg) {
    let poopy = this

    msg.channel.send(poopy.arrays.psPasta[Math.floor(Math.random() * poopy.arrays.psPasta.length)]).catch(() => { })
  },
  help: {
    name: 'pspasta/phexoniastudiospasta',
    value: 'Sends a random Phexonia Studios related copypasta or phrase to the channel.'
  },
  cooldown: 2500,
  type: 'Inside Joke'
}