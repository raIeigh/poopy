module.exports = {
    helpf: '(query | index) (nsfw channel only)',
    desc: 'e621',
    func: async function (matches, msg) {
        let poopy = this
        
        if (!msg.channel.nsfw) return 'no'

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var query = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var res = await poopy.modules.axios.request({
            url: 'https://e621.net/posts.json',
            method: 'GET',
            data: {
                tags: query,
                limit: 100
            },
            headers: {
                "User-Agent": `PoopyBOT/${poopy.package.version}`
            }
        }).catch(() => { })
        
        if (!res) return word

        var urls = res.data.posts.map(result => result.file.url)
        
        if (!urls || !urls.length) return word

        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    cmdconnected: 'e621'
}