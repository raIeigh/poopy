module.exports = {
  name: ['randomsentence'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json

    var sentenceJSON = json.sentenceJSON
    var sentence = sentenceJSON.data[Math.floor(Math.random() * sentenceJSON.data.length)].sentence
    if (!msg.nosend) await msg.reply(sentence).catch(() => { })
    return sentence
  },
  help: { name: 'randomsentence', value: 'Generates a random sentence.' },
  cooldown: 2500,
  type: 'Random'
}