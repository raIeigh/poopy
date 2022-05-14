module.exports = {
  name: ['randomword'],
  execute: async function (msg) {
    let poopy = this

    var wordJSON = poopy.json.wordJSON
    await msg.channel.send(wordJSON.data[Math.floor(Math.random() * wordJSON.data.length)].word.value).catch(() => { })
  },
  help: { name: 'randomword', value: 'Generates a random word.' },
  cooldown: 2500,
  type: 'Random'
}