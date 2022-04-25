module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random Tenor GIF out of the search query, if no index is specified.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var query = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var urls = []

        async function search() {
            return new Promise(resolve => {
                poopy.modules.axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).then((res) => {
                    var parsedBody = res.data

                    for (var i in parsedBody.results) {
                        var result = parsedBody.results[i]
                        urls.push(result)
                    }

                    resolve()
                }).catch(() => { })
            })
        }

        await search()

        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page].itemurl
    },
    attemptvalue: 10
}