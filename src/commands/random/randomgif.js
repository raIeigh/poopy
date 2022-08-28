module.exports = {
  name: ['randomgif'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let { axios } = poopy.modules

    var word = arrays.tenorDictionary[Math.floor(Math.random() * arrays.tenorDictionary.length)].toLowerCase()
    var res = await axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(word)}&key=${process.env.TENOR_KEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })
    if (res) {
      var parsedBody = res.data
      await msg.reply(parsedBody.results[Math.floor(Math.random() * parsedBody.results.length)].itemurl).catch(() => { })
    }
  },
  help: { name: 'randomgif', value: 'Sends a completely random Tenor GIF.' },
  cooldown: 2500,
  type: 'Random',
  envRequired: ['TENOR_KEY']
}