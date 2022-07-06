module.exports = {
    helpf: '(id | index)',
    desc: 'Returns a random YouTube video from the playlist, if no index is specified.',
    func: async function (matches) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var id = poopy.functions.getIndexOption(split, 0)[0]
        var page = poopy.functions.getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var countres = await poopy.vars.youtube.playlistItems.list({
            playlistId: id,
            part: 'snippet',
            maxResults: 50
        }).catch(() => { })
        
        if (!countres) return word

        var count = countres.data.pageInfo.totalResults
        var page = poopy.functions.parseNumber(page, { dft: Math.floor(Math.random() * count), min: 0, max: count - 1, round: true })
        
        var pagecount = 1

        while (page >= 50) {
            pagecount++
            page -= 50
        }

        var res = countres
        var nextToken = countres.data.nextPageToken

        while (pagecount > 1) {
            pagecount--
            res = await poopy.vars.youtube.playlistItems.list({
                playlistId: id,
                part: 'snippet',
                maxResults: 50,
                pageToken: nextToken
            }).catch(() => { })
            if (!res) return word
            nextToken = res.data.nextPageToken
        }

        var urls = res.data.items.map(result => `https://www.youtube.com/watch?v=${result.snippet.resourceId.videoId}`)
        
        if (!urls || !urls.length) return word

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['GOOGLEKEY']
}