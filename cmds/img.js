module.exports = {
    name: ['img', 'image'],
    execute: async function (msg, args) {
        let poopy = this

        async function image() {
            var page = 1
            var pageindex = args.indexOf('-page')
            if (pageindex > -1) {
                page = isNaN(Number(args[pageindex + 1])) ? 1 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 1
                args.splice(pageindex, 2)
            }

            var bing = false
            var bingindex = args.indexOf('-bing')
            if (bingindex > -1) {
                bing = true
                args.splice(bingindex, 1)
            }
            var search = args.slice(1).join(" ");

            var urls = await poopy.functions.fetchImages(search, bing, !msg.channel.nsfw).catch(() => { })

            if (!urls) {
                msg.channel.send('Error.').catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                return;
            }

            if (!urls.length) {
                msg.channel.send('Not found.').catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                return;
            }

            var number = page
            if (number > urls.length) number = urls.length;
            if (number < 1) number = 1
            
            await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = urls[page - 1]
                var lastUrls = [urls[page - 1]].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                lastUrls.splice(100)
                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls

                if (poopy.config.textEmbeds) return `${urls[page - 1]}\n\nImage ${page}/${urls.length}`
                else return {
                    "title": "Image Search Results For " + search,
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
            ], number)
        }

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            msg.channel.send('What do I search for?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }

        image(msg, args)
    },
    help: {
        name: 'img/image <query> [-page <number>] [-bing]',
        value: 'Search for a random image in Google or Bing.\nExample usage: p:img Burger -page 5 -bing'
    },
    cooldown: 2500,
    type: 'Fetching'
}