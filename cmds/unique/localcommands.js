module.exports = {
    name: ['localcommands', 'localcmds', 'servercommands', 'servercmds'],
    args: [{"name":"option","required":true,"specifarg":false,"orig":"<option>"}],
    subcommands: [{"name":"list","args":[],"description":"Gets a list of local commands."},{"name":"phrase","args":[{"name":"commandname","required":true,"specifarg":false,"orig":"<commandname>"}],"description":"Displays the phrase of a specific command."},{"name":"execute","args":[{"name":"commandname","required":true,"specifarg":false,"orig":"<commandname>"},{"name":"args","required":false,"specifarg":false,"orig":"[args]"}],"description":"Execute a specific command."},{"name":"add","args":[{"name":"commandname","required":true,"specifarg":false,"orig":"<commandname>"},{"name":"phrase","required":true,"specifarg":false,"orig":"<phrase>"}],"description":"Adds a new local command, if the name is available for use."},{"name":"import","args":[{"name":"id","required":true,"specifarg":false,"orig":"<id>"},{"name":"name","required":false,"specifarg":false,"orig":"[name]"}],"description":"Imports a new local command from Poopy's command template database (`commandtemplates` command) by ID."},{"name":"edit","args":[{"name":"commandname","required":true,"specifarg":false,"orig":"<commandname>"},{"name":"phrase","required":true,"specifarg":false,"orig":"<phrase>"}],"description":"Edits the local command, if it exists."},{"name":"delete","args":[{"name":"commandname","required":true,"specifarg":false,"orig":"<commandname>"}],"description":"Deletes the local command, if it exists."}],
    execute: async function (msg, args, opts) {
        let poopy = this

        var options = {
            list: async (msg) => {
                var localCmdsArray = []
                for (var i in poopy.data['guild-data'][msg.guild.id]['localcmds']) {
                    var cmd = poopy.data['guild-data'][msg.guild.id]['localcmds'][i]
                    localCmdsArray.push(`- ${cmd.name}`)
                }

                if (localCmdsArray.length <= 0) {
                    if (poopy.config.textEmbeds) await msg.reply('None.').catch(() => { })
                    else await msg.reply({
                        "title": `List of local commands for ${msg.guild.name}`,
                        "description": 'None.',
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Poopy`
                        },
                    }).catch(() => { })
                }
                
                var localCmds = poopy.functions.chunkArray(localCmdsArray, 10)

                await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                    if (poopy.config.textEmbeds) return `${localCmds[page - 1].join('\n')}\n\nPage ${page}/${localCmds.length}`
                    else return {
                        "title": `List of local commands for ${msg.guild.name}`,
                        "description": localCmds[page - 1].join('\n'),
                        "color": 0x472604,
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Page ${page}/${localCmds.length}`
                        },
                    }
                }, localCmds.length, msg.member, undefined, undefined, undefined, undefined, undefined, msg)
            },

            phrase: async (msg, args) => {
                if (!args[1]) {
                    await msg.reply('You gotta specify a command name!').catch(() => { })
                    return
                }

                var findCommand = poopy.data['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                if (findCommand > -1) {
                    await msg.reply(`\`${poopy.data['guild-data'][msg.guild.id]['localcmds'][findCommand].phrase}\``).catch(() => { })
                } else {
                    await msg.reply(`Not a valid command.`).catch(() => { })
                    return
                }
            },

            execute: async (msg, args) => {
                if (!args[1]) {
                    await msg.reply('You gotta specify a command name!').catch(() => { })
                    return
                }

                var findCommand = poopy.data['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                if (findCommand > -1) {
                    var content = msg.content

                    msg.content = `${poopy.data['guild-data'][msg.guild.id]['prefix']}${args.slice(1).join(' ')}`

                    var localCommand = poopy.data['guild-data'][msg.guild.id]['localcmds'][findCommand]
                    var oopts = { ...opts }
                    oopts.ownermode = localCommand.ownermode || oopts.ownermode
                    var phrase = await poopy.functions.getKeywordsFor(localCommand.phrase, msg, true, opts).catch(() => { }) ?? 'error'
                    await msg.reply({
                        content: phrase,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })

                    msg.content = content
                } else {
                    await msg.reply(`Not a valid command.`).catch(() => { })
                    return
                }
            },

            add: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        await msg.reply('You gotta specify a command name!').catch(() => { })
                        return
                    }
                    if (!args[2]) {
                        await msg.reply('You gotta specify a command phrase!').catch(() => { })
                        return
                    }

                    var saidMessage = args.slice(2).join(' ')
                    var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === args[1].toLowerCase())) || poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === args[1].toLowerCase())

                    if (findCommand) {
                        await msg.reply(`That name was already taken!`).catch(() => { })
                        return
                    } else {
                        poopy.data['guild-data'][msg.guild.id]['localcmds'].push({
                            name: args[1].toLowerCase(),
                            phrase: saidMessage
                        })

                        await msg.reply({
                            content: `✅ Added \`${args[1].toLowerCase()}\` command with phrase \`${saidMessage}\``,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },

            import: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        await msg.reply('You gotta specify the ID!').catch(() => { })
                        return
                    }

                    var id = args[1].replace(/#/g, '')

                    var findCommandTemplate = poopy.functions.globalData()['bot-data']['commandTemplates'].find(cmd => cmd.id == id)

                    if (findCommandTemplate) {
                        var name = args[2] ? args[2].toLowerCase() : findCommandTemplate.name

                        var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === name)) || poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === name)

                        if (findCommand) {
                            await msg.reply(`The name of that command was already taken!`).catch(() => { })
                            return
                        }

                        poopy.data['guild-data'][msg.guild.id]['localcmds'].push({
                            name: name,
                            phrase: findCommandTemplate.phrase
                        })

                        await msg.reply({
                            content: `✅ Imported \`${name}\` command from the database.`,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        await msg.reply('Not a valid ID.').catch(() => { })
                    }
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },

            edit: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        await msg.reply('You gotta specify a command name!').catch(() => { })
                        return
                    }
                    if (!args[2]) {
                        await msg.reply('You gotta specify a command phrase!').catch(() => { })
                        return
                    }

                    var saidMessage = args.slice(2).join(' ')
                    var findCommand = poopy.data['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                    if (findCommand > -1) {
                        poopy.data['guild-data'][msg.guild.id]['localcmds'][findCommand] = {
                            name: args[1].toLowerCase(),
                            phrase: saidMessage
                        }

                        await msg.reply({
                            content: `✅ Edited \`${args[1].toLowerCase()}\` command with phrase \`${saidMessage}\``,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        await msg.reply(`Not a valid command.`).catch(() => { })
                        return
                    }
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },

            delete: async (msg, args) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    if (!args[1]) {
                        await msg.reply('You gotta specify a command name!').catch(() => { })
                        return
                    }

                    var findCommand = poopy.data['guild-data'][msg.guild.id]['localcmds'].findIndex(cmd => cmd.name === args[1].toLowerCase())

                    if (findCommand > -1) {
                        poopy.data['guild-data'][msg.guild.id]['localcmds'].splice(findCommand, 1)

                        await msg.reply({
                            content: `✅ Removed \`${args[1].toLowerCase()}\` command.`,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        await msg.reply(`Not a valid command.`).catch(() => { })
                        return
                    }
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            if (poopy.config.textEmbeds) msg.reply("**list** - Gets a list of local commands.\n**phrase** <commandname> - Displays the phrase of a specific command.\n**execute** <commandname> [args] - Execute a specific command.\n**add** <commandname> <phrase> (moderator only) - Adds a new local command, if the name is available for use.\n**import** <id> [name] (moderator only) - Imports a new local command from Poopy's command template database (`commandtemplates` command) by ID.\n**edit** <commandname> <phrase> (moderator only) - Edits the local command, if it exists.\n**delete** <commandname> (moderator only) - Deletes the local command, if it exists.").catch(() => { })
            else msg.reply({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**list** - Gets a list of local commands.\n**phrase** <commandname> - Displays the phrase of a specific command.\n**execute** <commandname> [args] - Execute a specific command.\n**add** <commandname> <phrase> (moderator only) - Adds a new local command, if the name is available for use.\n**import** <id> [name] (moderator only) - Imports a new local command from Poopy's command template database (`commandtemplates` command) by ID.\n**edit** <commandname> <phrase> (moderator only) - Edits the local command, if it exists.\n**delete** <commandname> (moderator only) - Deletes the local command, if it exists.",
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
            await msg.reply('Not a valid option.').catch(() => { })
            return
        }

        await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'localcommands/localcmds/servercommands/servercmds <option>',
        value: 'Allows you to add custom commands to the server! Use the command alone for more info.'
    },
    cooldown: 2500,
    type: 'Unique'
}