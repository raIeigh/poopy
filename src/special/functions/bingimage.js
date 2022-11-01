module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random image out of the search query from Bing, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this
        let { splitKeyFunc, fetchImages, parseNumber } = poopy.functions

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var query = split[0] ?? ''
        var page = split[1] ?? ''
        var urls = await fetchImages(query, true, !msg.channel.nsfw, msg.author.id).catch(() => { })

        if (!urls || !urls.length) return word

        var page = parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: -urls.length, max: urls.length - 1, round: true })
        if (page < 0) page += urls.length

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['RAPIDAPI_KEY']
}