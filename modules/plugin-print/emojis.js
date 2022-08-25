const axios = require('axios')
const cheerio = require('cheerio')
var emojis
var gatheringEmojis = false

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function () {
    while (gatheringEmojis) {
        await sleep()
    }

    if (emojis) {
        return emojis
    }

    gatheringEmojis = true

    var res = await axios.get(`https://emojipedia.org/twitter/`).catch(() => { })
    var $ = cheerio.load(res.data)
    var gridEmojis = $('.emoji-grid').children()
    var emj = []

    for (var i in gridEmojis) {
        if (!isNaN(Number(i))) {
            var emoji = gridEmojis[i]
            var emojisAttribs = emoji.children.find(child => child.name === 'a').children.find(child => child.name === 'img').attribs
            var emojiUrl = (emojisAttribs['data-srcset'] || emojisAttribs.srcset).replace('/144/', '/240/').replace(' 2x', '')
            var unicode = emojiUrl.replace(/https:\/\/emojipedia-us\.s3\.dualstack\.us-west-1\.amazonaws.com\/thumbs\/[0-9]+\/twitter\/[0-9]+\/[a-z0-9-]+(_[a-z0-9-]+tone)?/, '').substring(1).replace(/(_[a-z0-9]+)?\.png$/, '')

            emj.push({
                url: emojiUrl,
                emoji: unicode.split('-').map(u => String.fromCodePoint(parseInt(u, 16))).join(''),
                unicode: unicode
            })
        }
    }

    emojis = emj
    gatheringEmojis = false
    return emojis
}