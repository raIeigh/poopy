module.exports = {
    helpf: '(id | index)',
    desc: 'Returns a random YouTube video from the channel, if no index is specified.',
    func: async function (matches) {
        let poopy = this
        let { splitKeyFunc, getIndexOption, parseNumber } = poopy.functions
        let vars = poopy.vars

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var id = getIndexOption(split, 0)[0]
        var page = getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var countres = await vars.youtube.search.list({
            channelId: id,
            type: 'video',
            part: 'snippet',
            order: 'date',
            maxResults: 50
        }).catch(() => { })

        if (!countres) return word

        var count = Math.min(countres.data.pageInfo.totalResults, 250)
        var page = parseNumber(page, { dft: Math.floor(Math.random() * count), min: 0, max: count - 1, round: true })

        var pagecount = 1

        while (page >= 50) {
            pagecount++
            page -= 50
        }
        console.log(pagecount)

        var res = countres
        var nextToken = countres.data.nextPageToken

        while (pagecount > 1) {
            pagecount--
            var nres = await vars.youtube.search.list({
                channelId: id,
                type: 'video',
                part: 'snippet',
                order: 'date',
                maxResults: 50,
                pageToken: nextToken
            }).catch(() => { })
            if (!nres || !nres.data.items.length) break
            res = nres
            nextToken = res.data.nextPageToken
        }

        page = Math.min(page, res.data.items.length)

        var urls = res.data.items.map(result => `https://www.youtube.com/watch?v=${result.id.videoId}`)

        if (!urls || !urls.length) return word

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['GOOGLEKEY'],
    cmdconnected: 'youtube'
}