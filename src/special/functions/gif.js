module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random Tenor GIF out of the search query, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this
        let { splitKeyFunc, parseNumber } = poopy.functions
        let { axios } = poopy.modules

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var query = split[0] ?? ''
        var page = split[1] ?? ''
        var res = await axios(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${process.env.TENOR_KEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })
        
        if (!res) return word

        var urls = res.data.results
        
        if (!urls || !urls.length) return word

        var page = parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page].itemurl
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['TENOR_KEY'],
    cmdconnected: 'gif'
}