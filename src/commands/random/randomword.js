module.exports = {
  name: ['randomword'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json

    var wordJSON = json.wordJSON
    var word = wordJSON.data[Math.floor(Math.random() * wordJSON.data.length)].word.value
    if (!msg.nosend) await msg.reply(word).catch(() => { })
    return word
  },
  help: { name: 'randomword', value: 'Generates a random word.' },
  cooldown: 2500,
  type: 'Random'
}