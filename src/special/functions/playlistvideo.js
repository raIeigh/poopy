module.exports = {
    helpf: '(id | index)',
    desc: 'Returns a random YouTube video from the playlist, if no index is specified.',
    func: async function (matches) {
        let poopy = this
        let { splitKeyFunc, parseNumber } = poopy.functions
        let vars = poopy.vars
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var id = split[0] ?? ''
        var page = split[1] ?? ''

        if (!tempdata.playlistvideos) tempdata.playlistvideos = {}

        var countres = tempdata.playlistvideos[id]?.[0] ?? await vars.youtube.playlistItems.list({
            playlistId: id,
            part: 'snippet',
            maxResults: 50
        }).catch(() => { })

        if (!countres) return word

        if (!tempdata.playlistvideos[id]) tempdata.playlistvideos[id] = []

        tempdata.playlistvideos[id][0] = countres

        var count = Math.min(countres.data.pageInfo.totalResults, 250)
        var page = parseNumber(page, { dft: Math.floor(Math.random() * count), min: -count, max: count - 1, round: true })
        if (page < 0) page += count

        var pagecount = 0
        var res = countres
        var nextToken = countres.data.nextPageToken

        while (page >= 50) {
            pagecount++
            page -= 50

            var nres = tempdata.playlistvideos[id][pagecount] ?? await vars.youtube.playlistItems.list({
                playlistId: id,
                part: 'snippet',
                maxResults: 50,
                pageToken: nextToken
            }).catch(() => { })
            if (!nres || !nres.data.items.length) break
            res = nres
            nextToken = res.data.nextPageToken
            tempdata.playlistvideos[id][pagecount] = res
        }

        page = Math.min(page, res.data.items.length)

        var urls = res.data.items.map(result => `https://www.youtube.com/watch?v=${result.snippet.resourceId.videoId}`)

        if (!urls || !urls.length) return word

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['GOOGLE_KEY'],
    cmdconnected: 'youtube'
}