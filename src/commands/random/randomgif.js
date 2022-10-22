module.exports = {
  name: ['randomgif'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions
    let { axios } = poopy.modules

    var word = randomChoice(json.arabJSON.words.filter(arab => !json.arabJSON.danger.includes(arab))).toLowerCase()
    var res = await axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(word)}&key=${process.env.TENOR_KEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })
    if (res) {
      var parsedBody = res.data
      var gif = parsedBody.results[Math.floor(Math.random() * parsedBody.results.length)].itemurl
      if (!msg.nosend) await msg.reply(gif).catch(() => { })
      return gif
    }
  },
  help: { name: 'randomgif', value: 'Sends a completely random Tenor GIF.' },
  cooldown: 2500,
  type: 'Random',
  envRequired: ['TENOR_KEY']
}