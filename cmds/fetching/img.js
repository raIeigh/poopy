module.exports = {
    name: ['img', 'image'],
    args: [{ "name": "query", "required": true, "specifarg": false }, { "name": "page", "required": false, "specifarg": true }],
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

        var urls = await poopy.functions.fetchImages(search, false, !msg.channel.nsfw).catch(() => { })

        if (!urls) {
            await msg.channel.send('Error.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
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
            poopy.functions.addLastUrl(msg, urls[page - 1])

            if (poopy.config.textEmbeds) return `${urls[page - 1]}\n\nImage ${page}/${urls.length}`
            else return {
                "title": "Google Image Search Results For " + search,
                "description": "Use the arrows to navigate.",
                "color": 0x472604,
                "footer": {
                    "text": "Image " + page + "/" + urls.length
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
        name: 'img/image <query> [-page <number>]',
        value: 'Search for a random image in Google.\nExample usage: p:img Burger -page 5'
    },
    cooldown: 2500,
    type: 'Fetching'
}