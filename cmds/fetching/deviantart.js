module.exports = {
    name: ['deviantart', 'deviant'],
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

        var body = await poopy.modules.axios.request(`https://backend.deviantart.com/rss.xml?type=deviation&q=${encodeURIComponent(search)}`).catch(() => { })

        if (!body) {
            await msg.channel.send('Error.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var results = await poopy.modules.xml2json(body.data).catch(() => { }) ?? { rss: { channel: [{}] } }

        if (!results.rss.channel[0].item) {
            await msg.channel.send('Not found.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var urls = results.rss.channel[0].item.filter(result => msg.channel.nsfw ? true : result['media:rating'][0] == 'nonadult').map(result => {
            return {
                posturl: result.link[0],
                url: result['media:content'][0]['$'].url,
                title: result.title[0],
                creator: result['media:credit'][0]['_'],
                rating: poopy.vars.caseModifiers[2](result['media:rating'][0])
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

            if (poopy.config.textEmbeds) return `${urls[page - 1].url}\n**Rating**: ${urls[page - 1].rating}\n**Score**: ${urls[page - 1].score}\n\nPost ${page}/${urls.length}`
            else return {
                "title": "DeviantArt Post Search Results For " + search,
                "description": `**[${urls[page - 1].title}](${urls[page - 1].posturl})**\n**Creator**: ${urls[page - 1].creator}\n**Rating**: ${urls[page - 1].rating}`,
                "color": 0x472604,
                "footer": {
                    "text": "Post " + page + "/" + urls.length
                },
                "image": {
                    "url": urls[page - 1].url
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
        name: 'deviantart/deviant <query> [-page <number>]',
        value: 'Search for a random post in DeviantArt.'
    },
    cooldown: 2500,
    type: 'Fetching'
}