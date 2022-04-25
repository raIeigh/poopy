module.exports = {
    name: ['gif', 'tenor'],
    execute: async function (msg, args) {
        let poopy = this

        async function gif(msg, parts) {
            var page = 0
            var pageindex = args.indexOf('-page')
            if (pageindex > -1) {
                page = isNaN(Number(args[pageindex + 1])) ? 0 : Number(args[pageindex + 1]) <= 1 ? 1 : Math.round(Number(args[pageindex + 1])) || 0
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
                    var imgEmbed = {
                        "title": "Tenor GIF Search Results For " + search,
                        "description": "Use the arrows to navigate.",
                        "color": 0x472604,
                        "footer": {
                            "text": "GIF " + number + "/" + urls.length
                        },
                        "image": {
                            "url": urls[number - 1]
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
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = urls[number - 1]
                    var lastUrls = [urls[number - 1]].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                    lastUrls.splice(100)
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                    msg.channel.sendTyping().catch(() => { })
                    var filter = (button) => {
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
                        imgEmbed = {
                            "title": "Tenor GIF Search Results For " + search,
                            "description": "Use the arrows to navigate.",
                            "color": 0x472604,
                            "footer": {
                                "text": "GIF " + number + "/" + urls.length
                            },
                            "image": {
                                "url": urls[number - 1]
                            },
                            "author": {
                                "name": msg.author.tag,
                                "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                            }
                        };
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = urls[number - 1]
                        var lastUrls = [urls[number - 1]].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                        lastUrls.splice(100)
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                        imgMessage.edit({
                            embeds: [imgEmbed],
                            components: [buttonRow, buttonRow2]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })
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
                } else {
                    var imgEmbed = {
                        "title": "Tenor GIF Search Results For: " + search,
                        "description": "Use the arrows to navigate.",
                        "color": 0x472604,
                        "footer": {
                            "text": "GIF " + number + "/" + urls.length
                        },
                        "image": {
                            "url": urls[number - 1]
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
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = urls[number - 1]
                    var lastUrls = [urls[number - 1]].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                    lastUrls.splice(100)
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                    msg.channel.sendTyping().catch(() => { })
                    var filter = (button) => {
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
                        imgEmbed = {
                            "title": "Tenor GIF Search Results For: " + search,
                            "description": "Use the arrows to navigate.",
                            "color": 0x472604,
                            "footer": {
                                "text": "GIF " + number + "/" + urls.length
                            },
                            "image": {
                                "url": urls[number - 1]
                            },
                            "author": {
                                "name": msg.author.tag,
                                "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                            }
                        };
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = urls[number - 1]
                        var lastUrls = [urls[number - 1]].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                        lastUrls.splice(100)
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                        imgMessage.edit({
                            embeds: [imgEmbed],
                            components: [buttonRow, buttonRow2]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })

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
                }
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