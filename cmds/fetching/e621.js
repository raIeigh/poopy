module.exports = {
    name: ['e621'],
    execute: async function (msg, args) {
        let poopy = this

        if (!msg.channel.nsfw) {
            await poopy.functions.findCommand('gif').execute.call(poopy, msg, ['gif', 'mario']).catch(() => { })
            return;
        }

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

        var body = await poopy.modules.axios.request({
            url: 'https://e621.net/posts.json',
            method: 'GET',
            data: {
                tags: search,
                limit: 100
            },
            headers: {
                "User-Agent": `PoopyBOT/${poopy.package.version}`
            }
        }).catch(() => { })

        if (!body) {
            await msg.channel.send('Error.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var results = body.data.posts

        var urls = results.map(result => {
            var isMP4 = result.tags.includes('animated') && result.file.ext != 'gif'
            var ratingNames = {
                s: 'Safe',
                q: 'Questionable',
                e: 'Explicit'
            }

            return {
                url: result.file.url,
                thumb: isMP4 ? result.sample.url : result.file.url,
                score: result.score.total,
                favcount = result.fav_count,
                rating: ratingNames[result.rating]
            }
        });

        if (!urls.length) {
            await msg.channel.send('Not found.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var number = page
        if (number > urls.length) number = urls.length;
        if (number < 1) number = 1

        await poopy.functions.navigateEmbed(msg.channel, async (page) => {
            poopy.functions.addLastUrl(msg.guild.id, msg.channel.id, urls[page - 1].url)

            if (poopy.config.textEmbeds) return `${urls[page - 1].url}\n**Rating**: ${urls[page - 1].rating}\n**Score**: ${urls[page - 1].score}\n**Favcount**: ${urls[page - 1].favcount}\n\nPost ${page}/${urls.length}`
            else return {
                "title": "E621 Post Search Results For " + search,
                "description": `**Source**: ${urls[page - 1].url}\n**Rating**: ${urls[page - 1].rating}\n**Score**: ${urls[page - 1].score}\n**Favcount**: ${urls[page - 1].favcount}`,
                "color": 0x472604,
                "footer": {
                    "text": "Post " + page + "/" + urls.length
                },
                "image": {
                    "url": urls[page - 1].thumb
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
    },
    help: {
        name: 'e621 <query> [-page <number>]',
        value: 'e621'
    },
    cooldown: 2500,
    type: 'Fetching'
}