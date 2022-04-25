module.exports = {
    name: ['localcommands', 'localcmds', 'servercommands', 'servercmds'],
    execute: async function (msg, args) {
        let poopy = this

        var options = {
            list: async (msg) => {
                var number = 1
                var localCmdsArray = []
                for (var i in poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds']) {
                    var cmd = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'][i]
                    localCmdsArray.push(`- ${cmd.name}`)
                }
                var localCmds = localCmdsArray.length ? poopy.functions.chunkArray(localCmdsArray, 10) : [['None.']]
                var cmdEmbed = {
                    "title": `List of local commands for ${msg.guild.name}`,
                    "description": localCmds[number - 1].join('\n'),
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Page ${number}/${localCmds.length}`
                    },
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
                            return Math.floor(Math.random() * localCmds.length) + 1
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
                            return localCmds.length
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

                await msg.channel.send({
                    embeds: [cmdEmbed],
                    components: [buttonRow]
                }).then(async sentMessage => {
                    var helpMessage = sentMessage
                    var filter = (button) => {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > localCmds.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        cmdEmbed = {
                            "title": `List of local commands for ${msg.guild.name}`,
                            "description": localCmds[number - 1].join('\n'),
                            "color": 0x472604,
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": `Page ${number}/${localCmds.length}`
                            },
                        };
                        helpMessage.edit({
                            embeds: [cmdEmbed],
                            components: [buttonRow]
                        }).catch(() => { })
                        button.deferUpdate().catch(() => { })
                    }
                    for (var i in poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i]) {
                            poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i]['active'] = false
                        }
                    }
                    var p = helpMessage.awaitMessageComponent({ componentType: 'BUTTON', time: 600000, filter }).then(() => {
                        for (var i in poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                            if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i] == p) {
                                poopy.tempdata[msg.guild.id][msg.author.id]['promises'][i] = undefined
                                break
                            }
                        }
                        if (!helpMessage.edit) return
                        helpMessage.edit({
                            embeds: [cmdEmbed]
                        }).catch(() => { })
                    })
                        .catch((err) => {
                            if (err.message.endsWith('reason: time')) {
                                helpMessage.edit({
                                    embeds: [cmdEmbed]
                                }).catch(() => { })
                            }
                        })
                    poopy.tempdata[msg.guild.id][msg.author.id]['promises'].push({ promise: p, active: true })
                })
                    .catch(() => { })
            },

            phrase: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify a command name!').catch(() => { })
                    return
                }

                var findCommand = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                if (findCommand > -1) {
                    msg.channel.send(`\`${poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'][findCommand].phrase}\``).catch(() => { })
                } else {
                    msg.channel.send(`Not a valid command.`).catch(() => { })
                    return
                }
            },

            add: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        msg.channel.send('You gotta specify a command name!').catch(() => { })
                        return
                    }
                    if (!args[2]) {
                        msg.channel.send('You gotta specify a command phrase!').catch(() => { })
                        return
                    }

                    var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)
                    var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === args[1].toLowerCase())) || poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === args[1].toLowerCase())

                    if (findCommand) {
                        msg.channel.send(`That name was already taken!`).catch(() => { })
                        return
                    } else {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].push({
                            name: args[1].toLowerCase(),
                            phrase: saidMessage
                        })

                        msg.channel.send({
                            content: `✅ Added \`${args[1].toLowerCase()}\` command with phrase \`${saidMessage}\``,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                    return;
                };
            },

            import: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        msg.channel.send('You gotta specify the ID!').catch(() => { })
                        return
                    }

                    var id = args[1].replace(/#/g, '')

                    var findCommandTemplate = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].find(cmd => cmd.id == id)

                    if (findCommandTemplate) {
                        var name = args[2] ? args[2].toLowerCase() : findCommandTemplate.name

                        var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === name)) || poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === name)

                        if (findCommand) {
                            msg.channel.send(`The name of that command was already taken!`).catch(() => { })
                            return
                        }

                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].push({
                            name: name,
                            phrase: findCommandTemplate.phrase
                        })

                        msg.channel.send({
                            content: `✅ Imported \`${name}\` command with phrase \`${findCommandTemplate.phrase}\``,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        msg.channel.send('Not a valid ID.').catch(() => { })
                    }
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                    return;
                };
            },

            edit: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        msg.channel.send('You gotta specify a command name!').catch(() => { })
                        return
                    }
                    if (!args[2]) {
                        msg.channel.send('You gotta specify a command phrase!').catch(() => { })
                        return
                    }

                    var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)
                    var findCommand = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                    if (findCommand > -1) {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'][findCommand] = {
                            name: args[1].toLowerCase(),
                            phrase: saidMessage
                        }

                        msg.channel.send({
                            content: `✅ Edited \`${args[1].toLowerCase()}\` command with phrase \`${saidMessage}\``,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        msg.channel.send(`Not a valid command.`).catch(() => { })
                        return
                    }
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                    return;
                };
            },

            delete: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        msg.channel.send('You gotta specify a command name!').catch(() => { })
                        return
                    }

                    var findCommand = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                    if (findCommand > -1) {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].splice(findCommand, 1)

                        msg.channel.send({
                            content: `✅ Removed \`${args[1].toLowerCase()}\` command.`,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        msg.channel.send(`Not a valid command.`).catch(() => { })
                        return
                    }
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            msg.channel.send({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**list** - Gets a list of local commands.\n**phrase** <commandname> - Displays the phrase of a specific command.\n**add** <commandname> <phrase> (admin only) - Adds a new local command, if the name is available for use.\n**import** <id> [name] (admin only) - Imports a new local command from Poopy's command template database (`commandtemplates` command) by ID.\n**edit** <commandname> <phrase> (admin only) - Edits the local command, if it exists.\n**delete** <commandname> (admin only) - Deletes the local command, if it exists.",
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": poopy.bot.user.username
                        },
                    }
                ]
            }).catch(() => { })
            return
        }

        if (!options[args[1].toLowerCase()]) {
            msg.channel.send('Not a valid option.').catch(() => { })
            return
        }

        await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'localcommands/localcmds <option>',
        value: 'Note: Keywords can be used.\n' +
            '\n' +
            '**list** - Gets a list of local commands.\n' +
            '**phrase** <commandname> - Displays the phrase of a specific command.\n' +
            '**add** <commandname> <phrase> (admin only) - Adds a new local command, if the name is available for use.\n' +
            "**import** <id> [name] (admin only) - Imports a new local command from Poopy's command template database (`commandtemplates` command) by ID.\n" +
            '**edit** <commandname> <phrase> (admin only) - Edits the local command, if it exists.\n' +
            '**delete** <commandname> (admin only) - Deletes the local command, if it exists.'
    },
    cooldown: 5000,
    type: 'Unique'
}