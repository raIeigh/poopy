module.exports = {
    name: ['youtube', 'yt', 'video'],
    execute: async function (msg, args) {
        let poopy = this

        async function video(msg, parts) {
            var page = 0
            var pageindex = args.indexOf('-page')
            if (pageindex > -1) {
                page = isNaN(Number(args[pageindex + 1])) ? 0 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 0
                parts.splice(pageindex, 2)
            }
            var search = parts.slice(1).join(" ");

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
                    var title = result.snippet.title.replace(/&quot;/g, '"').replace(/&#\d+;/g, (match) => {
                        return String.fromCharCode(match.substring(2, match.length - 1))
                    })

                    urls.push({
                        url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
                        thumb: result.snippet.thumbnails.high.url,
                        title: title
                    })
                }

                if (!urls.length) {
                    msg.channel.send('Not found.').catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                    return;
                }

                var number = 1
                if (page) {
                    number = Number(page)
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
                    var thumbresponse = await poopy.modules.axios.request(urls[number - 1].thumb.replace('hqdefault', 'hq720')).catch(() => { })
                    var imgEmbed = {
                        "title": "YouTube Video Search Results For " + search,
                        "description": `[${urls[number - 1].title}](${urls[number - 1].url})`,
                        "color": 0x472604,
                        "footer": {
                            "text": "Video " + number + "/" + urls.length
                        },
                        "image": {
                            "url": thumbresponse ? (thumbresponse.status >= 200 && thumbresponse.status < 300) ? urls[number - 1].thumb.replace('hqdefault', 'hq720') : urls[number - 1].thumb : urls[number - 1].thumb
                        },
                        "author": {
                            "name": msg.author.tag,
                            "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                        }
                    };
                    var reactions = [
                        {
                            reaction: "861253229723123762",
                            function: () => {
                                return 1
                            },
                        },
                        {
                            reaction: "861253229726793728",
                            function: (number) => {
                                return number - 1
                            },
                        },
                        {
                            reaction: "861253230070988860",
                            function: () => {
                                return Math.floor(Math.random() * urls.length) + 1
                            },
                        },
                        {
                            reaction: "861253229798621205",
                            function: (number) => {
                                return number + 1
                            },
                        },
                        {
                            reaction: "861253229740556308",
                            function: () => {
                                return urls.length
                            },
                        },
                    ]
                    var buttonRow = new poopy.modules.Discord.MessageActionRow()
                    reactions.forEach(reaction => {
                        var button = new poopy.modules.Discord.MessageButton()
                            .setStyle('PRIMARY')
                            .setEmoji(reaction.reaction)
                            .setCustomId(reaction.reaction)
                        buttonRow.addComponents([button])
                    })
                    var buttonRow2 = new poopy.modules.Discord.MessageActionRow()
                    var benson = new poopy.modules.Discord.MessageButton()
                        .setStyle('DANGER')
                        .setEmoji('874406183933444156')
                        .setCustomId('delete')
                    buttonRow2.addComponents([benson])

                    var imgMessage = await msg.channel.send({
                        embeds: [imgEmbed],
                        components: [buttonRow, buttonRow2]
                    }).catch(() => { })
                    if (!imgMessage) {
                        msg.channel.sendTyping().catch(() => { })
                        return
                    }
                    msg.channel.sendTyping().catch(() => { })
                    var filter = async (button) => {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (button.customId === 'delete') {
                            button.deferUpdate().catch(() => { })
                            imgMessage.delete().catch(() => { })
                            return
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > urls.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        var thumbresponse = await poopy.modules.axios.request(urls[number - 1].thumb.replace('hqdefault', 'hq720')).catch(() => { })
                        imgEmbed = {
                            "title": "YouTube Video Search Results For " + search,
                            "description": `[${urls[number - 1].title}](${urls[number - 1].url})`,
                            "color": 0x472604,
                            "footer": {
                                "text": "Video " + number + "/" + urls.length
                            },
                            "image": {
                                "url": thumbresponse ? (thumbresponse.status >= 200 && thumbresponse.status < 300) ? urls[number - 1].thumb.replace('hqdefault', 'hq720') : urls[number - 1].thumb : urls[number - 1].thumb
                            },
                            "author": {
                                "name": msg.author.tag,
                                "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                            }
                        };
                        imgMessage.edit({
                            embeds: [imgEmbed],
                            components: [buttonRow, buttonRow2]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })
                        var youtubeurl = await poopy.modules.youtubedl(urls[number - 1].url, {
                            format: '18',
                            'get-url': ''
                        }).catch(() => { })
                        if (youtubeurl) {
                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = youtubeurl
                            var lastUrls = [youtubeurl].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                            lastUrls.splice(100)
                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                        }
                    }
                    for (var i in poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i]) {
                            poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i]['active'] = false
                        }
                    }
                    var p = imgMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                        for (var i in poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                            if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i] == p) {
                                poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i] = undefined
                                break
                            }
                        }
                        if (!imgMessage.edit) return
                        imgMessage.edit({
                            embeds: [imgEmbed],
                            components: []
                        }).catch(() => { })
                    })
                        .catch((err) => {
                            if (err.message.endsWith('reason: time')) {
                                imgMessage.edit({
                                    embeds: [imgEmbed],
                                    components: []
                                }).catch(() => { })
                            }
                        })
                    poopy.tempdata[msg.guild.id][msg.author.id]['promises'].push({ promise: p, active: true })
                    var youtubeurl = await poopy.modules.youtubedl(urls[number - 1].url, {
                        format: '18',
                        'get-url': ''
                    }).catch(() => { })
                    if (youtubeurl) {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = youtubeurl
                        var lastUrls = [youtubeurl].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                        lastUrls.splice(100)
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                    }
                } else {
                    var thumbresponse = await poopy.modules.axios.request(urls[number - 1].thumb.replace('hqdefault', 'hq720')).catch(() => { })
                    var imgEmbed = {
                        "title": "YouTube Video Search Results For: " + search,
                        "description": `[${urls[number - 1].title}](${urls[number - 1].url})`,
                        "color": 0x472604,
                        "footer": {
                            "text": "Video " + number + "/" + urls.length
                        },
                        "image": {
                            "url": thumbresponse ? (thumbresponse.status >= 200 && thumbresponse.status < 300) ? urls[number - 1].thumb.replace('hqdefault', 'hq720') : urls[number - 1].thumb : urls[number - 1].thumb
                        },
                        "author": {
                            "name": msg.author.tag,
                            "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                        }
                    };
                    var reactions = [
                        {
                            reaction: "861253229723123762",
                            function: () => {
                                return 1
                            },
                        },
                        {
                            reaction: "861253229726793728",
                            function: (number) => {
                                return number - 1
                            },
                        },
                        {
                            reaction: "861253230070988860",
                            function: () => {
                                return Math.floor(Math.random() * urls.length) + 1
                            },
                        },
                        {
                            reaction: "861253229798621205",
                            function: (number) => {
                                return number + 1
                            },
                        },
                        {
                            reaction: "861253229740556308",
                            function: () => {
                                return urls.length
                            },
                        },
                    ]
                    var buttonRow = new poopy.modules.Discord.MessageActionRow()
                    reactions.forEach(reaction => {
                        var button = new poopy.modules.Discord.MessageButton()
                            .setStyle('PRIMARY')
                            .setEmoji(reaction.reaction)
                            .setCustomId(reaction.reaction)
                        buttonRow.addComponents([button])
                    })
                    var buttonRow2 = new poopy.modules.Discord.MessageActionRow()
                    var benson = new poopy.modules.Discord.MessageButton()
                        .setStyle('DANGER')
                        .setEmoji('874406183933444156')
                        .setCustomId('delete')
                    buttonRow2.addComponents([benson])

                    var imgMessage = await msg.channel.send({
                        embeds: [imgEmbed],
                        components: [buttonRow, buttonRow2]
                    }).catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                    var filter = async (button) => {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (button.customId === 'delete') {
                            button.deferUpdate().catch(() => { })
                            imgMessage.delete().catch(() => { })
                            return
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > urls.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        var thumbresponse = await poopy.modules.axios.request(urls[number - 1].thumb.replace('hqdefault', 'hq720')).catch(() => { })
                        imgEmbed = {
                            "title": "YouTube Video Search Results For: " + search,
                            "description": `[${urls[number - 1].title}](${urls[number - 1].url})`,
                            "color": 0x472604,
                            "footer": {
                                "text": "Video " + number + "/" + urls.length
                            },
                            "image": {
                                "url": thumbresponse ? (thumbresponse.status >= 200 && thumbresponse.status < 300) ? urls[number - 1].thumb.replace('hqdefault', 'hq720') : urls[number - 1].thumb : urls[number - 1].thumb
                            },
                            "author": {
                                "name": msg.author.tag,
                                "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                            }
                        };
                        imgMessage.edit({
                            embeds: [imgEmbed],
                            components: [buttonRow, buttonRow2]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })
                        var youtubeurl = await poopy.modules.youtubedl(urls[number - 1].url, {
                            format: '18',
                            'get-url': ''
                        }).catch(() => { })
                        if (youtubeurl) {
                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = youtubeurl
                            var lastUrls = [youtubeurl].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                            lastUrls.splice(100)
                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                        }
                    }
                    for (var i in poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i]) {
                            poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i]['active'] = false
                        }
                    }
                    var p = imgMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                        for (var i in poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                            if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i] == p) {
                                poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i] = undefined
                                break
                            }
                        }
                        if (!imgMessage.edit) return
                        imgMessage.edit({
                            embeds: [imgEmbed],
                            components: []
                        }).catch(() => { })
                    })
                        .catch((err) => {
                            if (err.message.endsWith('reason: time')) {
                                imgMessage.edit({
                                    embeds: [imgEmbed],
                                    components: []
                                }).catch(() => { })
                            }
                        })
                    poopy.tempdata[msg.guild.id][msg.author.id]['promises'].push({ promise: p, active: true })
                    var youtubeurl = await poopy.modules.youtubedl(urls[number - 1].url, {
                        format: '18',
                        'get-url': ''
                    }).catch(() => { })
                    if (youtubeurl) {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = youtubeurl
                        var lastUrls = [youtubeurl].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                        lastUrls.splice(100)
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                    }
                }
            });
        }

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            msg.channel.send('What do I search for?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }

        video(msg, args)
    },
    help: {
        name: 'youtube/yt/video <query> [-page <number>]',
        value: 'Search for a random video in YouTube.'
    },
    cooldown: 2500,
    type: 'Fetching'
}