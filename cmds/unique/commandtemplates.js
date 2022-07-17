module.exports = {
    name: ['commandtemplates', 'cmdtemplates'],
    execute: async function (msg, args) {
        let poopy = this

        async function createCommand(msg, args) {
            if (!args[1]) {
                await msg.channel.send('You gotta specify the name!').catch(() => { })
                return
            }

            if (!args[2]) {
                await msg.channel.send('You gotta specify the phrase!').catch(() => { })
                return
            }

            var name = args[1].toLowerCase()

            var params = {}

            var imageindex = args.indexOf('-image')
            if (imageindex > -1 && args[imageindex + 1]) {
                if (poopy.vars.validUrl.test(args[imageindex + 1])) {
                    params.image = args[imageindex + 1]
                } else {
                    await msg.channel.send('Not a valid image URL.').catch(() => { })
                    return
                }
            }

            var saidMessage = args.slice(2).join(' ')

            var optionIndex = args.findIndex(arg => arg.match(/-(description|syntax|image)/))
            var argmatches = saidMessage.match(/-(description|syntax)/g)
            if (argmatches) {
                for (var i in argmatches) {
                    var argmatch = argmatches[i]
                    var argIndex = args.indexOf(argmatch)
                    var nextArgs = args.slice(argIndex + 1)
                    var arg = ''
                    for (var j in nextArgs) {
                        var nextArg = nextArgs[j]
                        if (nextArg.match(/-(description|syntax|image)/)) break
                        arg += `${nextArg} `
                    }
                    arg = arg.substring(0, arg.length - 1)

                    params[argmatch.substring(1)] = arg
                }
            }

            var phraseArgs = args
            if (optionIndex > -1) {
                phraseArgs.splice(optionIndex)
            }
            phraseArgs.splice(0, 2)

            if (phraseArgs.length <= 0) {
                await msg.channel.send('You gotta specify the phrase!').catch(() => { })
                return
            }

            params.phrase = phraseArgs.join(' ')

            var findCommand = poopy.functions.globalData()['bot-data']['commandTemplates'].find(cmd => cmd.name === name && cmd.creator === msg.author.id)

            if (findCommand) {
                await msg.channel.send(`You've already created a command with that name! (ID: \`${findCommand.id}\`)`).catch(() => { })
                return
            } else {
                var id = poopy.functions.generateId(poopy.functions.globalData()['bot-data']['commandTemplates'].map(c => c.id))

                var commands = [{
                    name: name,
                    description: params.description,
                    phrase: params.phrase,
                    image: params.image,
                    syntax: params.syntax,
                    id: id,
                    creator: msg.author.id,
                    date: Math.floor(Date.now() / 1000)
                }].concat(poopy.functions.globalData()['bot-data']['commandTemplates'])
                poopy.functions.globalData()['bot-data']['commandTemplates'] = commands

                await msg.channel.send({
                    content: `✅ \`${name}\` was successfully registered to the command template database! (ID: \`${id}\`)`,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            }
        }

        var options = {
            list: async (msg) => {
                var dcmdTemplates = poopy.functions.globalData()['bot-data']['commandTemplates']

                if (dcmdTemplates.length <= 0) {
                    if (poopy.config.textEmbeds) msg.channel.send('there is nothing').catch(() => { })
                    else msg.channel.send({
                        embeds: [{
                            "title": `there is nothing`,
                            "description": 'wow',
                            "color": 0x472604,
                            "footer": {
                                "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                "text": poopy.bot.user.username
                            },
                        }]
                    }).catch(() => { })
                    return
                }

                dcmdTemplates.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                })

                var cmdTemplates = []
                for (var i in dcmdTemplates) {
                    var cmd = dcmdTemplates[i]

                    var name = cmd.name
                    var description = cmd.description
                    var syntax = cmd.syntax
                    var phrase = cmd.phrase
                    var image = cmd.image
                    var id = cmd.id
                    var creator = cmd.creator
                    var date = cmd.date

                    var long = phrase.length > 1016

                    if (long) {
                        phrase = phrase.substring(0, 1013) + '...'
                    }

                    var embed = {
                        "title": `${name}${syntax ? ` ${syntax}` : ''}`,
                        "color": 0x472604,
                        "fields": [
                            {
                                name: "Description",
                                value: description || 'No description available.'
                            },
                            {
                                name: "ID",
                                value: `\`${id}\``
                            },
                            {
                                name: "Phrase",
                                value: `\`\`\`\n${phrase}\n\`\`\``
                            },
                            {
                                name: "Date Updated",
                                value: `<t:${date}>`
                            }
                        ],
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Made by ${creator} - Command ${Number(i) + 1}/${dcmdTemplates.length}`
                        },
                    }

                    if (image) {
                        embed.image = {
                            url: image
                        }
                    }

                    var textEmbed = `\`${name}${syntax ? ` ${syntax}` : ''}\`\n\n**Description:** ${description || 'No description available.'}\n**ID:** \`${id}\`\n**Phrase:** \`${phrase}\`\n**Date Updated:** <t:${date}>\n\nMade by ${creator} - Command ${Number(i) + 1}/${dcmdTemplates.length}`.substring(0, 2000)

                    cmdTemplates.push({
                        embed: embed,
                        text: textEmbed
                    })
                }

                await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                    if (poopy.config.textEmbeds) return cmdTemplates[page - 1].text
                    else return cmdTemplates[page - 1].embed
                }, cmdTemplates.length, msg.member, [
                    {
                        emoji: '939523064658526278',
                        reactemoji: '⏬',
                        customid: 'import',
                        style: 'PRIMARY',
                        function: async (page, button) => {
                            if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                                var findCommandTemplate = dcmdTemplates[page - 1]

                                if (findCommandTemplate) {
                                    var name = findCommandTemplate.name

                                    var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === name)) || poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === name)

                                    if (findCommand) {
                                        if (poopy.config.useReactions) msg.channel.send(`The name of that command was already taken!`).catch(() => { })
                                        else button.reply({
                                            content: `The name of that command was already taken!`,
                                            ephemeral: true
                                        }).catch(() => { })
                                        return
                                    }

                                    poopy.data['guild-data'][msg.guild.id]['localcmds'].push({
                                        name: name,
                                        phrase: findCommandTemplate.phrase
                                    })

                                    await msg.channel.send({
                                        content: `✅ Imported \`${name}\` command with phrase \`${findCommandTemplate.phrase}\``,
                                        allowedMentions: {
                                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                        }
                                    }).catch(() => { })
                                } else {
                                    if (poopy.config.useReactions) msg.channel.send('Error fetching command.').catch(() => { })
                                    else button.reply({
                                        content: 'Error fetching command.',
                                        ephemeral: true
                                    }).catch(() => { })
                                }
                            } else {
                                if (poopy.config.useReactions) msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                                else button.reply({
                                    content: 'You need to be an administrator to execute that!',
                                    ephemeral: true
                                }).catch(() => { })
                            }
                        },
                        page: false
                    }
                ], undefined, undefined, undefined, undefined, msg)
            },

            search: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('You gotta specify the name of the command you want to search!').catch(() => { })
                    return
                }

                var saidMessage = args.join('').substring(args[0].length + 1).toLowerCase()

                var ddcmdTemplates = poopy.functions.globalData()['bot-data']['commandTemplates']
                var none = {
                    "title": `there is nothing`,
                    "description": 'wow',
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": poopy.bot.user.username
                    },
                }

                if (ddcmdTemplates.length <= 0) {
                    await msg.channel.send({
                        embeds: [none]
                    }).catch(() => { })
                    return
                }

                var dcmdTemplates = []

                ddcmdTemplates.forEach(cmd => {
                    if (cmd.name.includes(saidMessage)) {
                        dcmdTemplates.push(cmd)
                    }
                })

                if (dcmdTemplates.length) {
                    dcmdTemplates.sort((a, b) => Math.abs(1 - poopy.functions.similarity(a.name, saidMessage)) - Math.abs(1 - poopy.functions.similarity(b.name, saidMessage)))
                } else {
                    await msg.channel.send({
                        embeds: [none]
                    }).catch(() => { })
                    return
                }

                var cmdTemplates = []
                for (var i in dcmdTemplates) {
                    var cmd = dcmdTemplates[i]

                    var name = cmd.name
                    var description = cmd.description
                    var syntax = cmd.syntax
                    var phrase = cmd.phrase
                    var image = cmd.image
                    var id = cmd.id
                    var creator = cmd.creator
                    var date = cmd.date

                    var long = phrase.length > 1016

                    if (long) {
                        phrase = phrase.substring(0, 1013) + '...'
                    }

                    var embed = {
                        "title": `${name}${syntax ? ` ${syntax}` : ''}`,
                        "color": 0x472604,
                        "fields": [
                            {
                                name: "Description",
                                value: description || 'No description available.'
                            },
                            {
                                name: "ID",
                                value: `\`${id}\``
                            },
                            {
                                name: "Phrase",
                                value: `\`\`\`\n${phrase}\n\`\`\``
                            },
                            {
                                name: "Date Updated",
                                value: `<t:${date}>`
                            }
                        ],
                        "footer": {
                            "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            "text": `Made by ${creator} - Command ${Number(i) + 1}/${dcmdTemplates.length}`
                        },
                    }

                    if (image) {
                        embed.image = {
                            url: image
                        }
                    }

                    var textEmbed = `\`${name}${syntax ? ` ${syntax}` : ''}\`\n\n**Description:** ${description || 'No description available.'}\n**ID:** \`${id}\`\n**Phrase:** \`${phrase}\`\n**Date Updated:** <t:${date}>\n\nMade by ${creator} - Command ${Number(i) + 1}/${dcmdTemplates.length}`.substring(0, 2000)

                    cmdTemplates.push({
                        embed: embed,
                        text: textEmbed
                    })
                }

                await poopy.functions.navigateEmbed(msg.channel, async (page) => {
                    if (poopy.config.textEmbeds) return cmdTemplates[page - 1].text
                    else return cmdTemplates[page - 1].embed
                }, cmdTemplates.length, msg.member, [
                    {
                        emoji: '939523064658526278',
                        reactemoji: '⏬',
                        customid: 'import',
                        style: 'PRIMARY',
                        function: async (page, button) => {
                            if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                                var findCommandTemplate = dcmdTemplates[page - 1]

                                if (findCommandTemplate) {
                                    var name = findCommandTemplate.name

                                    var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === name)) || poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === name)

                                    if (findCommand) {
                                        if (poopy.config.useReactions) msg.channel.send(`The name of that command was already taken!`).catch(() => { })
                                        else button.reply({
                                            content: `The name of that command was already taken!`,
                                            ephemeral: true
                                        }).catch(() => { })
                                        return
                                    }

                                    poopy.data['guild-data'][msg.guild.id]['localcmds'].push({
                                        name: name,
                                        phrase: findCommandTemplate.phrase
                                    })

                                    await msg.channel.send({
                                        content: `✅ Imported \`${name}\` command with phrase \`${findCommandTemplate.phrase}\``,
                                        allowedMentions: {
                                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                        }
                                    }).catch(() => { })
                                } else {
                                    if (poopy.config.useReactions) msg.channel.send('Error fetching command.').catch(() => { })
                                    else button.reply({
                                        content: 'Error fetching command.',
                                        ephemeral: true
                                    }).catch(() => { })
                                }
                            } else {
                                if (poopy.config.useReactions) msg.channel.send('You need to be a moderator to execute that!').catch(() => { })
                                else button.reply({
                                    content: 'You need to be a moderator to execute that!',
                                    ephemeral: true
                                }).catch(() => { })
                            }
                        },
                        page: false
                    }
                ], undefined, undefined, undefined, undefined, msg)
            },

            register: async (msg, args) => {
                await createCommand(msg, args)
            },

            add: async (msg, args) => {
                await createCommand(msg, args)
            },

            edit: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('You gotta specify the ID!').catch(() => { })
                    return
                }

                var id = args[1].replace(/#/g, '')
                var command = poopy.functions.globalData()['bot-data']['commandTemplates'].find(cmd => cmd.id === id)
                var commandIndex = poopy.functions.globalData()['bot-data']['commandTemplates'].findIndex(cmd => cmd.id === id)

                if (command && commandIndex > -1) {
                    if (command.creator !== msg.author.id) {
                        await msg.channel.send(`idiot you didn't make that command`).catch(() => { })
                        return
                    }

                    var params = {
                        date: Math.floor(Date.now() / 1000)
                    }

                    var nameindex = args.indexOf('-name')
                    if (nameindex > -1 && args[nameindex + 1]) {
                        params.name = args[nameindex + 1].toLowerCase()
                    }

                    var imageindex = args.indexOf('-image')
                    if (imageindex > -1 && args[imageindex + 1]) {
                        if (poopy.vars.validUrl.test(args[imageindex + 1])) {
                            params.image = args[imageindex + 1]
                        } else {
                            await msg.channel.send('Not a valid image URL.').catch(() => { })
                            return
                        }
                    }

                    var saidMessage = args.slice(2).join(' ')

                    var argmatches = saidMessage.match(/-(phrase|description|syntax)/g)
                    if (argmatches) {
                        for (var i in argmatches) {
                            var argmatch = argmatches[i]
                            var argIndex = args.indexOf(argmatch)
                            var nextArgs = args.slice(argIndex + 1)
                            var arg = ''
                            for (var j in nextArgs) {
                                var nextArg = nextArgs[j]
                                if (nextArg.match(/-(phrase|description|syntax|name|image)/)) break
                                arg += `${nextArg} `
                            }
                            arg = arg.substring(0, arg.length - 1)

                            params[argmatch.substring(1)] = arg
                        }
                    }

                    if (params.name) {
                        var findCommand = poopy.functions.globalData()['bot-data']['commandTemplates'].find(cmd => cmd.name === params.name && cmd.creator === msg.author.id)

                        if (findCommand) {
                            await msg.channel.send(`You've already created a command with that name! (ID: \`${findCommand.id}\`)`).catch(() => { })
                            return
                        }
                    }

                    for (var param in params) {
                        poopy.functions.globalData()['bot-data']['commandTemplates'][commandIndex][param] = params[param]
                    }

                    await msg.channel.send(`✅ Command successfully updated.`).catch(() => { })
                } else {
                    await msg.channel.send('Not a valid ID.').catch(() => { })
                }
            },

            delete: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('You gotta specify the ID!').catch(() => { })
                    return
                }

                var id = args[1].replace(/#/g, '')
                var command = poopy.functions.globalData()['bot-data']['commandTemplates'].find(cmd => cmd.id === id)
                var commandIndex = poopy.functions.globalData()['bot-data']['commandTemplates'].findIndex(cmd => cmd.id === id)

                if (command && commandIndex > -1) {
                    if (command.creator !== msg.author.id) {
                        await msg.channel.send(`idiot you didn't make that command`).catch(() => { })
                        return
                    }

                    poopy.functions.globalData()['bot-data']['commandTemplates'].splice(commandIndex, 1)

                    await msg.channel.send(`✅ Command successfully deleted.`).catch(() => { })
                } else {
                    await msg.channel.send('Not a valid ID.').catch(() => { })
                }
            },
        }

        if (!args[1]) {
            if (poopy.config.textEmbeds) msg.channel.send("**list** - Sends a navigable embed with a list of all command templates made by the users of Poopy.\n\n**search** <query> - Searches for every command in the command database that matches the query.\n\n**register**/**add** <name> <phrase> {-description <text>} [-image <url>] [-syntax <text>] - Registers the command with the respective name, description and syntax (if supplied), it'll then be assigned an ID that can be used to import it via the `localcmds` command.\n\n**edit** <id> [-name <text>] [-phrase <text>] [-description <text>] [-image <url>] [-syntax <text>] - Allows you to edit the command with the respective ID in the database, if it exists and you made it.\n\n**delete** <id> - Permanently deletes the command from the database with the respective ID, if it exists and YOU made it.").catch(() => { })
            else msg.channel.send({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**list** - Sends a navigable embed with a list of all command templates made by the users of Poopy.\n\n**search** <query> - Searches for every command in the command database that matches the query.\n\n**register**/**add** <name> <phrase> {-description <text>} [-image <url>] [-syntax <text>] - Registers the command with the respective name, description and syntax (if supplied), it'll then be assigned an ID that can be used to import it via the `localcmds` command.\n\n**edit** <id> [-name <text>] [-phrase <text>] [-description <text>] [-image <url>] [-syntax <text>] - Allows you to edit the command with the respective ID in the database, if it exists and you made it.\n\n**delete** <id> - Permanently deletes the command from the database with the respective ID, if it exists and YOU made it.",
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
            await msg.channel.send('Not a valid option.').catch(() => { })
            return
        }

        await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'commandtemplates/cmdtemplates <option>',
        value: 'Gives you access to a global database of command templates you can use in your servers! Anyone can contribute to it. Use the command alone for more info.'
    },
    cooldown: 5000,
    type: 'Unique'
}