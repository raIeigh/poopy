module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random image out of the search query from Bing, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this
        let { splitKeyFunc, getIndexOption, fetchImages, parseNumber } = poopy.functions

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var query = getIndexOption(split, 0)[0]
        var page = getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var urls = await fetchImages(query, true, !msg.channel.nsfw).catch(() => { })

        if (!urls || !urls.length) return word

        var page = parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['RAPIDAPI_KEY']
}