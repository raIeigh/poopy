module.exports = {
    name: ['rule34', 'r34'],
    args: [{"name":"query","required":true,"specifarg":false,"orig":"<query>"},{"name":"page","required":false,"specifarg":true,"orig":"[-page <number>]"}],
    execute: async function (msg, args) {
        let poopy = this
        let { findCommand, unescapeHTML, navigateEmbed, addLastUrl } = poopy.functions
        let { axios, DiscordTypes } = poopy.modules
        let vars = poopy.vars
        let config = poopy.config

        if (!msg.channel.nsfw) {
            await findCommand('img').execute.call(poopy, msg, ['img', 'snail']).catch(() => { })
            return;
        }

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

        var body = await axios(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${encodeURIComponent(search)}`).catch(() => { })

        if (!body) {
            await msg.reply('Error.').catch(() => { })
            return;
        }

        var results = body.data

        var urls = results.map(result => {
            var tags = unescapeHTML(result.tags)
            if (tags.length > 50) tags = `${tags.substring(0, 50)}...`
            var isMP4 = result.tags.split(' ').includes('animated') && !result.image.endsWith('gif')

            return {
                posturl: `https://rule34.xxx/index.php?page=post&s=view&id=${result.id}`,
                url: result.file_url,
                title: tags,
                thumb: isMP4 ? result.sample_url : result.file_url,
                score: result.score,
                rating: vars.caseModifiers[2](result.rating)
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

            if (config.textEmbeds) return `${urls[page - 1].url}\n**Rating**: ${urls[page - 1].rating}\n**Score**: ${urls[page - 1].score}\n\nPost ${page}/${urls.length}`
            else return {
                "title": "Rule 34 Post Search Results For " + search,
                "description": `**[${urls[page - 1].title}](${urls[page - 1].posturl})**\n[Media Url](${urls[page - 1].url})\n**Rating**: ${urls[page - 1].rating}\n**Score**: ${urls[page - 1].score}`,
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
                style: DiscordTypes.ButtonStyle.Danger,
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
        name: 'rule34/r34 <query> [-page <number>] (nsfw channel only)',
        value: 'its funny because its porn'
    },
    cooldown: 2500,
    type: 'Fetching'
}