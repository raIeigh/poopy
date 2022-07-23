module.exports = {
    helpf: '(query | index)',
    desc: 'rule 34',
    func: async function (matches, msg) {
        let poopy = this
        
        if (!msg.channel.nsfw) return 'no'

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var query = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var res = await poopy.modules.axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${encodeURIComponent(query)}`).catch(() => { })
        
        if (!res) return word

        var urls = res.data.map(result => result.file_url)
        
        if (!urls || !urls.length) return word

        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5
}