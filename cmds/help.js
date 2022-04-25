module.exports = {
    name: ['help', 'commands', 'cmds'],
    execute: async function (msg, args) {
        let poopy = this

        var saidMessage = args.join(' ').substring(args[0].length + 1)
        var number = 1
        if (saidMessage) {
            var fCmds = []

            poopy.commands.forEach(cmd => {
                if (cmd.name.find(name => name.toLowerCase().includes(saidMessage.toLowerCase()))) {
                    fCmds.push(cmd)
                }
            })

            if (fCmds.length) {
                fCmds.sort((a, b) => Math.abs(1 - poopy.functions.similarity(a.name.find(name => name.toLowerCase().includes(saidMessage.toLowerCase())), saidMessage)) - Math.abs(1 - poopy.functions.similarity(b.name.find(name => name.toLowerCase().includes(saidMessage.toLowerCase())), saidMessage)))

                var findCmds = fCmds.map(cmd => {
                    return {
                        title: cmd.help.name,
                        fields: [
                            {
                                "name": "Description",
                                "value": cmd.help.value
                            },
                            {
                                "name": "Cooldown",
                                "value": cmd.cooldown ? `${cmd.cooldown / 1000} seconds` : 'None'
                            },
                            {
                                "name": "Type",
                                "value": cmd.type
                            },
                        ]
                    }
                })

                var cmdEmbed = {
                    "title": findCmds[number - 1].title,
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Command ${number}/${findCmds.length}`
                    },
                    "fields": findCmds[number - 1].fields,
                }
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
                            return Math.floor(Math.random() * findCmds.length) + 1
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
                            return findCmds.length
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

                msg.channel.send({
                    embeds: [cmdEmbed],
                    components: [buttonRow]
                }).then(async sentMessage => {
                    var helpMessage = sentMessage
                    var filter = (button) => {
                        if (poopy.tempdata[msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > findCmds.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        cmdEmbed = {
                            "title": findCmds[number - 1].title,
                            "color": 0x472604,
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": `Command ${number}/${findCmds.length}`
                            },
                            "fields": findCmds[number - 1].fields,
                        };
                        helpMessage.edit({
                            embeds: [cmdEmbed],
                            components: [buttonRow]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })
                    }
                    for (var i in poopy.tempdata[msg.author.id]['promises']) {
                        if (poopy.tempdata[msg.author.id]['promises'][i]) {
                            poopy.tempdata[msg.author.id]['promises'][i]['active'] = false
                        }
                    }
                    var p = helpMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                        for (var i in poopy.tempdata[msg.author.id]['promises']) {
                            if (poopy.tempdata[msg.author.id]['promises'][i] == p) {
                                poopy.tempdata[msg.author.id]['promises'][i] = undefined
                                break
                            }
                        }
                        if (!helpMessage.edit) return
                        helpMessage.edit({
                            embeds: [cmdEmbed],
                            components: []
                        }).catch(() => { })
                    })
                        .catch((err) => {
                            if (err.message.endsWith('reason: time')) {
                                helpMessage.edit({
                                    embeds: [cmdEmbed],
                                    components: []
                                }).catch(() => { })
                            }
                        })
                    poopy.tempdata[msg.author.id]['promises'].push({ promise: p, active: true })
                })
                    .catch(() => { })
            } else {
                msg.channel.send({
                    embeds: [
                        {
                            "description": "No commands match your search.",
                            "color": 0x472604,
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": poopy.bot.user.username
                            },
                        }
                    ]
                }).catch(() => { })
            }
            return
        }
        var jsonid = poopy.config.ownerids.find(id => id == msg.author.id) || poopy.config.jsoning.find(id => id == msg.author.id);
        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        var cmdEmbed = {
            "title": `${poopy.vars.shelpCmds[number - 1].type} Commands`,
            "description": "Arguments between \"<>\" are required.\nArguments between \"[]\" are optional.\nArguments between \"{}\" are optional but should normally be supplied.\nMultiple commands can be executed separating them with \"-|-\".\nFile manipulation commands have special options that can be used:\n`-encodingpreset <preset>` - More info in `reencode` command.\n`-filename <name>` - Saves the file as the specified name.\n`-catbox` - Forces the file to be uploaded to catbox.moe.\n`-nosend` - Does not send the file, but stores its catbox.moe URL in the channel's last urls.",
            "color": 0x472604,
            "footer": {
                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                "text": `Page ${number}/${poopy.vars.shelpCmds.length}`
            },
            "fields": poopy.vars.shelpCmds[number - 1].commands
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
                    return Math.floor(Math.random() * poopy.vars.shelpCmds.length) + 1
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
                    return poopy.vars.shelpCmds.length
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

        var categoryOptions = {}

        for (var i in poopy.vars.shelpCmds) {
            var shelp = poopy.vars.shelpCmds[i]
            if (categoryOptions[shelp.type] == undefined) {
                categoryOptions[shelp.type] = Number(i) + 1
            }
        }

        var categoriesMenu = Object.keys(categoryOptions).map(cat => {
            return {
                label: cat,
                description: poopy.vars.categories[cat] || '',
                value: cat
            }
        })

        var menuRow = new poopy.modules.Discord.MessageActionRow()
        var selectMenu = new poopy.modules.Discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Select Category')
            .addOptions(categoriesMenu)

        menuRow.addComponents([selectMenu])

        await msg.author.send({
            embeds: [cmdEmbed],
            components: [buttonRow, menuRow]
        }).then(async sentMessage => {
            var helpMessage = sentMessage
            if (jsonid !== undefined) {
                var jsoncmdEmbed = {
                    "title": "JSON Club Commands",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": poopy.bot.user.username
                    },
                    "fields": poopy.vars.jsonCmds
                };
                await msg.author.send({
                    embeds: [jsoncmdEmbed]
                }).catch(() => { })
            }
            if (ownerid !== undefined) {
                var devcmdEmbed = {
                    "title": "Owner Commands",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": poopy.bot.user.username
                    },
                    "fields": poopy.vars.devCmds
                };
                await msg.author.send({
                    embeds: [devcmdEmbed]
                }).catch(() => { })
            }
            msg.channel.send('✅ Check your DMs.').catch(() => { })
            var filter = (interaction) => {
                if (poopy.tempdata[msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return

                if (interaction.isButton()) {
                    var button = interaction

                    if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                        button.deferUpdate().catch(() => { })
                        return
                    }
                    if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > poopy.vars.shelpCmds.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                        button.deferUpdate().catch(() => { })
                        return
                    }
                    number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                    menuRow = new poopy.modules.Discord.MessageActionRow()
                    selectMenu = new poopy.modules.Discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder(poopy.vars.shelpCmds[number - 1].type)
                        .addOptions(categoriesMenu)
                    menuRow.addComponents([selectMenu])
                    cmdEmbed = {
                        "title": `${poopy.vars.shelpCmds[number - 1].type} Commands`,
                        "description": "Arguments between \"<>\" are required.\nArguments between \"[]\" are optional.\nArguments between \"{}\" are optional but should normally be supplied.\nMultiple commands can be executed separating them with \"-|-\".\nFile manipulation commands have special options that can be used:\n`-encodingpreset <preset>` - More info in `reencode` command.\n`-filename <name>` - Saves the file as the specified name.\n`-catbox` - Forces the file to be uploaded to catbox.moe.\n`-nosend` - Does not send the file, but stores its catbox.moe URL in the channel's last urls.",
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Page ${number}/${poopy.vars.shelpCmds.length}`
                        },
                        "fields": poopy.vars.shelpCmds[number - 1].commands
                    };
                    button.update({
                        embeds: [cmdEmbed],
                        components: [buttonRow, menuRow]
                    }).catch(() => { })
                } else if (interaction.isSelectMenu()) {
                    var option = interaction

                    if (!(option.user.id === msg.author.id && option.user.id !== poopy.bot.user.id && !option.user.bot)) {
                        option.deferUpdate().catch(() => { })
                        return
                    }
                    number = categoryOptions[option.values[0]]
                    menuRow = new poopy.modules.Discord.MessageActionRow()
                    selectMenu = new poopy.modules.Discord.MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder(poopy.vars.shelpCmds[number - 1].type)
                        .addOptions(categoriesMenu)
                    menuRow.addComponents([selectMenu])
                    cmdEmbed = {
                        "title": `${poopy.vars.shelpCmds[number - 1].type} Commands`,
                        "description": "Arguments between \"<>\" are required.\nArguments between \"[]\" are optional.\nArguments between \"{}\" are optional but should normally be supplied.\nMultiple commands can be executed separating them with \"-|-\".\nFile manipulation commands have special options that can be used:\n`-encodingpreset <preset>` - More info in `reencode` command.\n`-filename <name>` - Saves the file as the specified name.\n`-catbox` - Forces the file to be uploaded to catbox.moe.\n`-nosend` - Does not send the file, but stores its catbox.moe URL in the channel's last urls.",
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Page ${number}/${poopy.vars.shelpCmds.length}`
                        },
                        "fields": poopy.vars.shelpCmds[number - 1].commands
                    };
                    option.update({
                        embeds: [cmdEmbed],
                        components: [buttonRow, menuRow]
                    }).catch(() => { })
                }
            }
            for (var i in poopy.tempdata[msg.author.id]['promises']) {
                if (poopy.tempdata[msg.author.id]['promises'][i]) {
                    poopy.tempdata[msg.author.id]['promises'][i]['active'] = false
                }
            }
            var p = helpMessage.awaitMessageComponent({ time: 600000, filter }).then(() => {
                for (var i in poopy.tempdata[msg.author.id]['promises']) {
                    if (poopy.tempdata[msg.author.id]['promises'][i] == p) {
                        poopy.tempdata[msg.author.id]['promises'][i] = undefined
                        break
                    }
                }
                if (!helpMessage.edit) return
                helpMessage.edit({
                    embeds: [cmdEmbed],
                    components: []
                }).catch(() => { })
            })
                .catch((err) => {
                    if (err.message.endsWith('reason: time')) {
                        helpMessage.edit({
                            embeds: [cmdEmbed],
                            components: []
                        }).catch(() => { })
                    }
                })
            poopy.tempdata[msg.author.id]['promises'].push({ promise: p, active: true })
        })
            .catch(() => {
                msg.channel.send('Couldn\'t send help to you. Do you have me blocked?')
                return
            })
    },
    help: {
        name: 'help/commands/cmds [command]',
        value: 'HELP! You can specify the command parameter if you want help on a certain command.'
    },
    cooldown: 2500,
    type: 'Main'
}