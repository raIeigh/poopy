module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random image out of the search query from DeviantArt, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var query = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var res = await poopy.modules.axios.request(`https://backend.deviantart.com/rss.xml?type=deviation&q=${encodeURIComponent(query)}`).catch(() => { })

        if (!res) return word

        var results = await poopy.modules.xml2json(res.data).catch(() => { }) ?? { rss: { channel: [{}] } }

        if (!results.rss.channel[0].item) return word

        var urls = results.rss.channel[0].item.filter(result => msg.channel.nsfw ? true : result['media:rating'][0] == 'nonadult').map(result => result['media:content'][0]['$'].url)
        
        if (!urls || !urls.length) return word

        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    cmdconnected: 'deviantart'
}