module.exports = {
  name: ['randomword'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json

    var wordJSON = json.wordJSON
    await msg.reply(wordJSON.data[Math.floor(Math.random() * wordJSON.data.length)].word.value).catch(() => { })
  },
  help: { name: 'randomword', value: 'Generates a random word.' },
  cooldown: 2500,
  type: 'Random'
}