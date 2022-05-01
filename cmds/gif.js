module.exports = {
    name: ['gif', 'tenor'],
    execute: async function (msg, args) {
        let poopy = this

        async function gif(msg, parts) {
            var page = 1
            var pageindex = args.indexOf('-page')
            if (pageindex > -1) {
                page = isNaN(Number(args[pageindex + 1])) ? 1 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 1
                parts.splice(pageindex, 2)
            }
            var search = parts.slice(1).join(" ");

            poopy.modules.axios.request(`https://g.tenor.com/v1/search?q=${encodeURIComponent(search)}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).then(async (res) => {
                var results = res.data.results

                var urls = [];

                for (var i in results) {
                    var result = results[i]
                    urls.push(result.media[0].gif.url)
                }

                if (!urls.length) {
                    msg.channel.send('Not found.').catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                    return;
                }

                var number = Number(page)
                if (isNaN(number)) {
                    msg.channel.send({
                        content: '**' + page + '** is not a number.',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                    return;
                };
                if (number > urls.length) number = urls.length;
                if (number < 1) number = 1

                await poopy.functions.navigateEmbed(msg.channel, async (page) => {
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
            }).catch(() => { })
        }

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            msg.channel.send('What do I search for?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }

        gif(msg, args)
    },
    help: {
        name: 'gif/tenor <query> [-page <number>]',
        value: 'Search for a random GIF in Tenor.\n' +
            'Example usage: p:gif house exploding -page 3'
    },
    cooldown: 2500,
    type: 'Fetching'
}