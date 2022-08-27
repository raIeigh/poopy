module.exports = {
    name: ['gif', 'tenor'],
    args: [{"name":"query","required":true,"specifarg":false,"orig":"<query>"},{"name":"page","required":false,"specifarg":true,"orig":"[-page <number>]"}],
    execute: async function (msg, args) {
        let poopy = this
        let { axios } = poopy.modules
        let { navigateEmbed, addLastUrl } = poopy.functions
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            await msg.reply('What do I search for?!').catch(() => { })
            return;
        }

        var page = 1
        var pageindex = args.indexOf('-page')
        if (pageindex > -1) {
            page = isNaN(Number(args[pageindex + 1])) ? 1 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 1
            args.splice(pageindex, 2)
        }
        var search = args.slice(1).join(" ");

        var res = await axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(search)}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).catch(() => { })

        if (!res) {
            await msg.reply('Error.').catch(() => { })
            return;
        }

        var results = res.data.results

        var urls = [];

        for (var i in results) {
            var result = results[i]
            urls.push(result.media[0].gif.url)
        }

        if (!urls.length) {
            await msg.reply('Not found.').catch(() => { })
            return;
        }

        var number = page
        if (number > urls.length) number = urls.length;
        if (number < 1) number = 1

        await navigateEmbed(msg.channel, async (page) => {
            addLastUrl(msg, urls[page - 1])

            if (config.textEmbeds) return `${urls[page - 1]}\n\nGIF ${page}/${urls.length}`
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
        ], number, undefined, undefined, undefined, msg)
    },
    help: {
        name: 'gif/tenor <query> [-page <number>]',
        value: 'Search for a random GIF in Tenor.\n' +
            'Example usage: p:gif house exploding -page 3'
    },
    cooldown: 2500,
    type: 'Fetching',
    envRequired: ['TENORKEY']
}