module.exports = {
    name: ['youtube', 'yt', 'video'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            await msg.channel.send('What do I search for?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var page = 1
        var pageindex = args.indexOf('-page')
        if (pageindex > -1) {
            page = isNaN(Number(args[pageindex + 1])) ? 1 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 1
            args.splice(pageindex, 2)
        }
        var search = args.slice(1).join(" ");

        poopy.vars.youtube.search.list({
            type: 'video',
            q: search,
            part: 'snippet',
            maxResults: 50,
            safeSearch: msg.channel.nsfw ? 'none' : 'strict'
        }).then(async (body) => {
            var results = body.data.items

            var urls = [];

            for (var i in results) {
                var result = results[i]
                var title = result.snippet.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#\d+;/g, (match) => {
                    return String.fromCharCode(match.substring(2, match.length - 1))
                })

                urls.push({
                    url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
                    thumb: result.snippet.thumbnails.high.url,
                    title: title
                })
            }

            if (!urls.length) {
                await msg.channel.send('Not found.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return;
            }

            var number = page
            if (number > urls.length) number = urls.length;
            if (number < 1) number = 1

            await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                var youtubeurl = await poopy.modules.youtubedl(urls[page - 1].url, {
                    format: '18',
                    'get-url': ''
                }).catch(() => { })
                if (youtubeurl) {
                    undefined = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
                    undefined = youtubeurl
                    var lastUrls = [youtubeurl].concat(poopy.functions.lastUrls(msg.guild.id, msg.channel.id))
                    lastUrls.splice(100)
                    undefined = lastUrls
                }

                var thumbresponse = await poopy.modules.axios.request(urls[page - 1].thumb.replace('hqdefault', 'hq720')).catch(() => { })

                if (poopy.config.textEmbeds) return `${urls[page - 1].url}\n\nVideo ${page}/${urls.length}`
                else return {
                    "title": "YouTube Video Search Results For " + search,
                    "description": `[${urls[page - 1].title}](${urls[page - 1].url})`,
                    "color": 0x472604,
                    "footer": {
                        "text": "Video " + page + "/" + urls.length
                    },
                    "image": {
                        "url": thumbresponse ? (thumbresponse.status >= 200 && thumbresponse.status < 300) ? urls[page - 1].thumb.replace('hqdefault', 'hq720') : urls[page - 1].thumb : urls[page - 1].thumb
                    },
                    "author": {
                        "name": msg.author.tag,
                        "icon_url": msg.author.displayAvatarURL({
                            dynamic: true, size: 1024, format: 'png'
                        })
                    }
                }
            }, urls.length, msg.member, [
                {
                    emoji: '874406183933444156',
                    reactemoji: '❌',
                    customid: 'delete',
                    style: 'DANGER',
                    function: async (_, __, resultsMsg, collector) => {
                        collector.stop()
                        resultsMsg.delete().catch(() => { })
                    },
                    page: false
                }
            ], number, undefined, undefined, undefined, msg)
        })
    },
    help: {
        name: 'youtube/yt/video <query> [-page <number>]',
        value: 'Search for a random video in YouTube.'
    },
    cooldown: 2500,
    type: 'Fetching',
    envRequired: ['GOOGLEKEY']
}