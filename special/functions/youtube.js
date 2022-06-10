module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random YouTube video out of the search query, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var query = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var res = await poopy.modules.axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })
        
        if (!res) return word

        var urls = res.data.results.map(result => `https://www.youtube.com/watch?v=${result.id.videoId}`)
        
        if (!urls || !urls.length) return word

        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return await poopy.modules.youtubedl(urls[page], {
            format: '18',
            'get-url': ''
        }).catch(() => { }) ?? urls[page]
    },
    attemptvalue: 10,
    limit: 5
}