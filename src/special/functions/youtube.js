module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random YouTube video out of the search query, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this
        let { splitKeyFunc, parseNumber } = poopy.functions
        let vars = poopy.vars

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var query = split[0] ?? ''
        var page = split[1] ?? ''
        var res = await vars.youtube.search.list({
            type: 'video',
            q: query,
            part: 'snippet',
            maxResults: 50,
            safeSearch: msg.channel.nsfw ? 'none' : 'strict'
        }).catch(() => { })
        
        if (!res) return word

        var urls = res.data.items.map(result => `https://www.youtube.com/watch?v=${result.id.videoId}`)
        
        if (!urls || !urls.length) return word

        var page = parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: -urls.length, max: urls.length - 1, round: true })
        if (page < 0) page += urls.length

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['GOOGLE_KEY'],
    cmdconnected: 'youtube'
}