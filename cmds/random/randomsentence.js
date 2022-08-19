module.exports = {
  name: ['randomsentence'],
  args: [],
  execute: async function (msg) {
    let poopy = this

    var sentenceJSON = poopy.json.sentenceJSON
    await msg.reply(sentenceJSON.data[Math.floor(Math.random() * sentenceJSON.data.length)].sentence).catch(() => { })
  },
  help: { name: 'randomsentence', value: 'Generates a random sentence.' },
  cooldown: 2500,
  type: 'Random'
}