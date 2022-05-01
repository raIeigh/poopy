module.exports = {
    name: ['localcommands', 'localcmds', 'servercommands', 'servercmds'],
    execute: async function (msg, args) {
        let poopy = this

        var options = {
            list: async (msg) => {
                var localCmdsArray = []
                for (var i in poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds']) {
                    var cmd = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'][i]
                    localCmdsArray.push(`- ${cmd.name}`)
                }
                
                if (localCmdsArray.length <= 0) {
                    if (poopy.config.textEmbeds) msg.channel.send('None.').catch(() => { })
                    else msg.channel.send({
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
                }, localCmds.length, msg.member)
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
            if (poopy.config.textEmbeds) msg.channel.send("**list** - Gets a list of local commands.\n**phrase** <commandname> - Displays the phrase of a specific command.\n**add** <commandname> <phrase> (admin only) - Adds a new local command, if the name is available for use.\n**import** <id> [name] (admin only) - Imports a new local command from Poopy's command template database (`commandtemplates` command) by ID.\n**edit** <commandname> <phrase> (admin only) - Edits the local command, if it exists.\n**delete** <commandname> (admin only) - Deletes the local command, if it exists.").catch(() => { })
            else msg.channel.send({
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
        name: 'localcommands/localcmds/servercommands/servercmds <option>',
        value: 'Allows you to add custom commands for your servers! Use the command alone for more info.'
    },
    cooldown: 5000,
    type: 'Unique'
}