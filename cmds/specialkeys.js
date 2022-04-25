module.exports = {
    name: ['specialkeys', 'keywords', 'functions'],
    execute: async function (msg) {
        let poopy = this

        var keynumber = 1
        var modnumber = 1
        var infoEmbed = {
            "title": 'Special Keywords/Functions',
            "color": 0x472604,
            "footer": {
                icon_url: poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                text: poopy.bot.user.username
            },
            "fields": [
                {
                    "name": "WHAT are keywords and functions?",
                    "value": "Keywords and functions are special words that can be used in any command which are replaced with something new (keywords), or generate something new with the arguments inside their parentheses (functions), depending on their purpose.",
                },
                {
                    "name": "Example Usages",
                    "value": "```\np:say _member really likes _member\n```\n```\np:img _word\n```\n```\np:meme4 \"lower(FOOL)\"\n```\n```\np:meme4 \"upper(_arab)!\"\n```\n```\np:spam 25 _sayori\n```\n```\np:say choice(da minion | da bob)\n```",
                },
                {
                    "name": "Templates",
                    "value": "Speech Bubble\n```\ncommand(vmerge | https://cdn.discordapp.com/attachments/760223418968047629/938887195471786034/unknown.png lasturl())\n```\nSquare Crop\n```\ncommand(crop | declare(url | lasturl()) declare(width | width({url})) declare(height | height({url})) declare(biggest | if(equal({width} | {height}) | both | if(bigger({width} | {height}) | width | height))) {url} if(notequal({biggest} | both) | -x if(equal({biggest} | width) | math({width} / 2 - {height} / 2) | 0) -y if(equal({biggest} | height) | math({height} / 2 - {width} / 2) | 0) -w if(equal({biggest} | width) | {height} | {width}) -h if(equal({biggest} |height) | {width} | {height})))\n```\nHerobrine\n```\ncommand(overlay | https://cdn.discordapp.com/attachments/879658786376265768/930909703595253810/herobrines.png lasturl() -origin center bottom -offsetpos -135 -221 -width 30 -height 30 -keepaspectratio increase)\n```"
                }
            ]
        }
        var keyEmbed = {
            "title": `Special Keywords`,
            "description": "Here's a list of all keywords that can be used.",
            "color": 0x472604,
            "footer": {
                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                "text": `Page ${keynumber}/${poopy.vars.keyfields.length}`
            },
            "fields": poopy.vars.keyfields[keynumber - 1]
        };
        var modEmbed = {
            "title": `Special Functions`,
            "description": "Here's a list of all functions that can be used.",
            "color": 0x472604,
            "footer": {
                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                "text": `Page ${modnumber}/${poopy.vars.funcfields.length}`
            },
            "fields": poopy.vars.funcfields[modnumber - 1]
        };
        var keyreactions = [
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
                    return Math.floor(Math.random() * poopy.vars.keyfields.length) + 1
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
                    return poopy.vars.keyfields.length
                },
            },
        ]

        var funcreactions = [
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
                    return Math.floor(Math.random() * poopy.vars.funcfields.length) + 1
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
                    return poopy.vars.funcfields.length
                },
            },
        ]

        var keybuttonRow = new poopy.modules.Discord.MessageActionRow()
        keyreactions.forEach(reaction => {
            var button = new poopy.modules.Discord.MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(reaction.reaction)
                .setCustomId(reaction.reaction)
            keybuttonRow.addComponents([button])
        })

        var funcbuttonRow = new poopy.modules.Discord.MessageActionRow()
        funcreactions.forEach(reaction => {
            var button = new poopy.modules.Discord.MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(reaction.reaction)
                .setCustomId(reaction.reaction)
            funcbuttonRow.addComponents([button])
        })

        await msg.author.send({
            embeds: [infoEmbed]
        }).catch(() => {
            msg.channel.send('Couldn\'t send info to you. Do you have me blocked?')
            return
        })

        await msg.author.send({
            embeds: [keyEmbed],
            components: [keybuttonRow]
        }).then(async sentMessage => {
            var helpMessage = sentMessage
            var filter = (button) => {
                if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                    button.deferUpdate().catch(() => { })
                    return
                }
                if (keyreactions.find(findreaction => findreaction.reaction === button.customId).function(keynumber) > poopy.vars.keyfields.length || keyreactions.find(findreaction => findreaction.reaction === button.customId).function(keynumber) < 1) {
                    button.deferUpdate().catch(() => { })
                    return
                }
                keynumber = keyreactions.find(findreaction => findreaction.reaction === button.customId).function(keynumber)
                keyEmbed = {
                    "title": `Keywords`,
                    "description": "Here's a list of all keywords that can be used.",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Page ${keynumber}/${poopy.vars.keyfields.length}`
                    },
                    "fields": poopy.vars.keyfields[keynumber - 1]
                };
                helpMessage.edit({
                    embeds: [keyEmbed],
                    components: [keybuttonRow]
                }).catch(() => { })
                button.deferUpdate().catch(() => { })
            }
            helpMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                if (!helpMessage) return
                helpMessage.edit({
                    embeds: [keyEmbed]
                }).catch(() => { })
            })
                .catch(() => { })
        })
            .catch(() => {
                msg.channel.send('Couldn\'t send keywords to you. Do you have me blocked?')
                return
            })

        await msg.author.send({
            embeds: [modEmbed],
            components: [funcbuttonRow]
        }).then(async sentMessage => {
            var helpMessage = sentMessage
            var filter = (button) => {
                if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                    button.deferUpdate().catch(() => { })
                    return
                }
                if (funcreactions.find(findreaction => findreaction.reaction === button.customId).function(modnumber) > poopy.vars.funcfields.length || funcreactions.find(findreaction => findreaction.reaction === button.customId).function(modnumber) < 1) {
                    button.deferUpdate().catch(() => { })
                    return
                }
                modnumber = funcreactions.find(findreaction => findreaction.reaction === button.customId).function(modnumber)
                modEmbed = {
                    "title": `Functions`,
                    "description": "Here's a list of all functions that can be used.",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Page ${modnumber}/${poopy.vars.funcfields.length}`
                    },
                    "fields": poopy.vars.funcfields[modnumber - 1]
                };
                helpMessage.edit({
                    embeds: [modEmbed],
                    components: [funcbuttonRow]
                }).catch(() => { })
                button.deferUpdate().catch(() => { })
            }
            helpMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                if (!helpMessage) return
                helpMessage.edit({
                    embeds: [modEmbed]
                }).catch(() => { })
            })
                .catch(() => { })
        })
            .catch(() => {
                msg.channel.send('Couldn\'t send functions to you. Do you have me blocked?')
                return
            })

        msg.channel.send('✅ Check your DMs.').catch(() => { })
    },
    help: {
        name: 'specialkeys/keywords/functions',
        value: 'DMs you a list of special keywords that can be used for all commands.'
    },
    cooldown: 2500,
    type: 'Unique'
}