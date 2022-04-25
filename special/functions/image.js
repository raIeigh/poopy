module.exports = {
    helpf: '(query | index)',
    desc: 'Returns a random image out of the search query, if no index is specified.',
    func: async function (matches) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var query = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var urls = []

        async function search() {
            return new Promise(resolve => {
                poopy.modules.gis(query, async function (_, results) {
                    for (var i in results) {
                        var result = results[i]
                        var url = result.url.replace(/\\u([a-z0-9]){4}/g, (match) => {
                            return String.fromCharCode(Number('0x' + match.substring(2, match.length)))
                        })

                        urls.push(url)
                    }

                    resolve()
                })
            })
        }

        await search()

        if (!urls.length) return word

        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page]
    },
    attemptvalue: 10
}