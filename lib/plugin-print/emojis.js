// All emojis here are fetched from Twemoji

const axios = require('axios')
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

    var res = await axios.get(`https://api.github.com/repos/twitter/twemoji/git/trees/master?recursive=1`).catch(() => { })
    var data = res.data
    var gridEmojis = data.tree.filter(file => file.path.startsWith('assets/72x72/'))
    var emojiData = gridEmojis.map(emoji => {
        var name = emoji.path.match(/[^/]+$/)[0]
        var unicode = name.replace('.png', '')
        var emojiUrl = `https://twemoji.maxcdn.com/v/14.0.2/72x72/${name}`

        return {
            url: emojiUrl,
            emoji: unicode.split('-').map(u => String.fromCodePoint(parseInt(u, 16))).join(''),
            unicode: unicode
        }
    })

    if (emojiData) emojis = emojiData
    gatheringEmojis = false
    return emojiData
}