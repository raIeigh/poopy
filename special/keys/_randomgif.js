module.exports = {
    desc: 'Returns a random Tenor gif.',
    func: async function (msg) {
        let poopy = this
        let { axios } = poopy.modules
        let arrays = poopy.arrays

        var res = await axios.get(`https://g.tenor.com/v1/search?q=${encodeURIComponent(arrays.tenorDictionary[Math.floor(Math.random() * arrays.tenorDictionary.length)].toLowerCase())}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })
        if (!res) return ''

        var parsedBody = res.data
        if (parsedBody.results) {
            if (parsedBody.results[0]) {
                return parsedBody.results[Math.floor(Math.random() * parsedBody.results.length)].itemurl
            } else {
                return ''
            }
        } else {
            return ''
        }
    },
    attemptvalue: 2,
    envRequired: ['TENORKEY'],
    cmdconnected: 'randomgif'
}