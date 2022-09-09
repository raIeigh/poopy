module.exports = {
    desc: 'Returns a random Tenor gif.',
    func: async function (msg) {
        let poopy = this
        let { axios } = poopy.modules
        let json = poopy.json
        let { randomChoice } = poopy.functions

        var res = await axios.get(`https://g.tenor.com/v1/search?q=${encodeURIComponent(randomChoice(json.arabJSON.words.filter(arab => !json.arabJSON.danger.includes(arab))))}&key=${process.env.TENOR_KEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })
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
    envRequired: ['TENOR_KEY'],
    cmdconnected: 'randomgif'
}