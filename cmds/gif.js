module.exports = {
    name: ['gif', 'tenor'],
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

        var res = await poopy.modules.axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(search)}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })

        if (res) {
            var results = res.data.results

            var urls = [];

            for (var i in results) {
                var result = results[i]
                urls.push(result.media[0].gif.url)
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
                undefined = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
                undefined = urls[page - 1]
                var lastUrls = [urls[page - 1]].concat(poopy.functions.lastUrls(msg.guild.id, msg.channel.id))
                lastUrls.splice(100)
                undefined = lastUrls

                if (poopy.config.textEmbeds) return `${urls[page - 1]}\n\nGIF ${page}/${urls.length}`
                else return {
                    "title": "Tenor GIF Search Results For " + search,
                    "description": "Use the arrows to navigate.",
                    "color": 0x472604,
                    "footer": {
                        "text": "GIF " + page + "/" + urls.length
                    },
                    "image": {
                        "url": urls[page - 1]
                    },
                    "author": {
                        "name": msg.author.tag,
                        "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
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
            ], number)
        }
    },
    help: {
        name: 'gif/tenor <query> [-page <number>]',
        value: 'Search for a random GIF in Tenor.\n' +
            'Example usage: p:gif house exploding -page 3'
    },
    cooldown: 2500,
    type: 'Fetching'
}