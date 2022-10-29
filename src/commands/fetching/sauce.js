module.exports = {
    name: ['sauce'],
    args: [{ "name": "query", "required": true, "specifarg": false, "orig": "<query>" }, { "name": "page", "required": false, "specifarg": true, "orig": "[-page <number>]" }],
    execute: async function (msg, args) {
        let poopy = this
        let { findCommand, navigateEmbed, lastUrl, addLastUrl } = poopy.functions
        let { axios, Discord } = poopy.modules
        let config = poopy.config

        if (!msg.channel.nsfw) {
            await findCommand('img').execute.call(poopy, msg, ['img', 'sauce']).catch(() => { })
            return;
        }

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined && !lastUrl(msg, 0)) {
            await msg.reply('What do I search for?!').catch(() => { })
            return;
        }

        var page = 1
        var pageindex = args.indexOf('-page')
        if (pageindex > -1) {
            page = isNaN(Number(args[pageindex + 1])) ? 1 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 1
            args.splice(pageindex, 2)
        }
        var search = lastUrl(msg, 0) || args.slice(1).join(" ");

        var body = await axios.get(`https://saucenao.com/search.php?db=999&output_type=2&numres=50&api_key=${process.env.SAUCENAO_KEY}&url=${search}`).catch(() => { })

        if (!body) {
            await msg.reply('Error.').catch(() => { })
            return;
        }

        var results = body.data.results

        var urls = results.map(result => {
            return {
                url: result.data.ext_urls?.[0] || result.header.thumbnail,
                title: result.data.title || result.data.eng_name || result.data.jp_name || result.data.source || result.header.index_name,
                thumb: result.header.thumbnail,
                similarity: result.header.similarity
            }
        });

        if (!urls.length) {
            await msg.reply('Not found.').catch(() => { })
            return;
        }

        var number = page
        if (number > urls.length) number = urls.length;
        if (number < 1) number = 1

        if (!msg.nosend) await navigateEmbed(msg.channel, async (page) => {
            addLastUrl(msg, urls[page - 1].url)

            if (config.textEmbeds) return `${urls[page - 1].url}\n**Similarity**: ${urls[page - 1].similarity}\n\nPost ${page}/${urls.length}`
            else return {
                "title": "SauceNAO reverse search results",
                "description": `**[${urls[page - 1].title}](${urls[page - 1].url})**\n**Similarity**: ${urls[page - 1].similarity}`,
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
                        dynamic: true, size: 1024, extension: 'png'
                    })
                }
            }
        }, urls.length, msg.member, [
            {
                emoji: '874406183933444156',
                reactemoji: '❌',
                customid: 'delete',
                style: Discord.ButtonStyle.Danger,
                function: async (_, __, resultsMsg, collector) => {
                    collector.stop()
                    resultsMsg.delete().catch(() => { })
                },
                page: false
            }
        ], number, undefined, undefined, undefined, msg)
        return urls[page - 1].url
    },
    help: {
        name: '<:newpoopy:839191885310066729> sauce <query> [-page <number>] (nsfw channel only)',
        value: 'it gives you a sauce'
    },
    cooldown: 2500,
    type: 'Fetching',
    envRequired: ['SAUCENAO_KEY']
}