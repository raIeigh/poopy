module.exports = {
  name: ['randomgif'],
  execute: async function (msg) {
    let poopy = this

    var word = poopy.arrays.tenorDictionary[Math.floor(Math.random() * poopy.arrays.tenorDictionary.length)].toLowerCase()
    poopy.modules.axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(word)}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).then((res) => {
      var parsedBody = res.data
      msg.channel.send(parsedBody.results[Math.floor(Math.random() * parsedBody.results.length)].itemurl).catch(() => { })
    }).catch(() => { })
  },
  help: { name: 'randomgif', value: 'Sends a completely random Tenor GIF.' },
  cooldown: 2500,
  type: 'Random'
}