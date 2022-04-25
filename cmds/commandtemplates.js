module.exports = {
    name: ['commandtemplates', 'cmdtemplates'],
    execute: async function (msg, args) {
        let poopy = this

        async function createCommand(msg, args) {
            if (!args[1]) {
                msg.channel.send('You gotta specify the name!').catch(() => { })
                return
            }

            if (!args[2]) {
                msg.channel.send('You gotta specify the phrase!').catch(() => { })
                return
            }

            var name = args[1].toLowerCase()

            var params = {}

            var imageindex = args.indexOf('-image')
            if (imageindex > -1 && args[imageindex + 1]) {
                if (poopy.vars.validUrl.test(args[imageindex + 1])) {
                    params.image = args[imageindex + 1]
                } else {
                    msg.channel.send('Not a valid image URL.').catch(() => { })
                    return
                }
            }

            var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)

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
                msg.channel.send('You gotta specify the phrase!').catch(() => { })
                return
            }

            params.phrase = phraseArgs.join(' ')

            var findCommand = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].find(cmd => cmd.name === name && cmd.creator === msg.author.id)

            if (findCommand) {
                msg.channel.send(`You've already created a command with that name! (ID: \`${findCommand.id}\`)`).catch(() => { })
                return
            } else {
                var id = poopy.functions.generateId(true)

                var commands = [{
                    name: name,
                    description: params.description,
                    phrase: params.phrase,
                    image: params.image,
                    syntax: params.syntax,
                    id: id,
                    creator: msg.author.id,
                    date: Math.floor(Date.now() / 1000)
                }].concat(poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'])
                poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'] = commands

                msg.channel.send({
                    content: `✅ \`${name}\` was successfully registered to the command template database! (ID: \`${id}\`)`,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            }
        }

        var options = {
            list: async (msg) => {
                var number = 1
                var dcmdTemplates = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates']
                var none = {
                    "title": `there is nothing`,
                    "description": 'wow',
                    "color": 0x472604,
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": poopy.bot.user.username
                    },
                }

                if (dcmdTemplates.length <= 0) {
                    msg.channel.send({
                        embeds: [none]
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

                    cmdTemplates.push(embed)
                }

                var cmdEmbed = cmdTemplates[number - 1]
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
                            return Math.floor(Math.random() * cmdTemplates.length) + 1
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
                            return cmdTemplates.length
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

                var importButtonRow = new poopy.modules.Discord.MessageActionRow()
                var importButton = new poopy.modules.Discord.MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('939523064658526278')
                    .setCustomId('import')
                importButtonRow.addComponents([importButton])

                await msg.channel.send({
                    embeds: [cmdEmbed],
                    components: [buttonRow, importButtonRow]
                }).then(async sentMessage => {
                    var helpMessage = sentMessage
                    var filter = (button) => {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (button.customId == importButton.customId) {
                            if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                                var findCommandTemplate = dcmdTemplates[number - 1]

                                if (findCommandTemplate) {
                                    var name = findCommandTemplate.name

                                    var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === name)) || poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === name)

                                    if (findCommand) {
                                        button.reply({
                                            content: `The name of that command was already taken!`,
                                            ephemeral: true
                                        }).catch(() => { })
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
                                    button.reply({
                                        content: 'Error fetching command.',
                                        ephemeral: true
                                    }).catch(() => { })
                                }
                            } else {
                                button.reply({
                                    content: 'You need to be an administrator to execute that!',
                                    ephemeral: true
                                }).catch(() => { })
                            };
                            button.deferUpdate().catch(() => { })
                            return;
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > cmdTemplates.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        cmdEmbed = cmdTemplates[number - 1]
                        helpMessage.edit({
                            embeds: [cmdEmbed],
                            components: [buttonRow, importButtonRow]
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
                            embeds: [cmdEmbed],
                            components: []
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

            search: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify the name of the command you want to search!').catch(() => { })
                    return
                }

                var saidMessage = args.join('').substring(args[0].length + 1).toLowerCase()

                var number = 1
                var ddcmdTemplates = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates']
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
                    msg.channel.send({
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
                    msg.channel.send({
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

                    cmdTemplates.push(embed)
                }

                var cmdEmbed = cmdTemplates[number - 1]
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
                            return Math.floor(Math.random() * cmdTemplates.length) + 1
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
                            return cmdTemplates.length
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

                var importButtonRow = new poopy.modules.Discord.MessageActionRow()
                var importButton = new poopy.modules.Discord.MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('939523064658526278')
                    .setCustomId('import')
                importButtonRow.addComponents([importButton])

                await msg.channel.send({
                    embeds: [cmdEmbed],
                    components: [buttonRow, importButtonRow]
                }).then(async sentMessage => {
                    var helpMessage = sentMessage
                    var filter = (button) => {
                        if (poopy.tempdata[msg.guild.id][msg.author.id]['promises'].find(promise => promise.promise === p).active === false) return
                        if (!(button.user.id === msg.author.id && button.user.id !== poopy.bot.user.id && !button.user.bot)) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        if (button.customId == importButton.customId) {
                            if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                                var findCommandTemplate = dcmdTemplates[number - 1]

                                if (findCommandTemplate) {
                                    var name = findCommandTemplate.name

                                    var findCommand = poopy.commands.find(cmd => cmd.name.find(n => n === name)) || poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === name)

                                    if (findCommand) {
                                        button.reply({
                                            content: `The name of that command was already taken!`,
                                            ephemeral: true
                                        }).catch(() => { })
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
                                    button.reply({
                                        content: 'Error fetching command.',
                                        ephemeral: true
                                    }).catch(() => { })
                                }
                            } else {
                                button.reply({
                                    content: 'You need to be an administrator to execute that!',
                                    ephemeral: true
                                }).catch(() => { })
                            };
                            button.deferUpdate().catch(() => { })
                            return;
                        }
                        if (reactions.find(findreaction => findreaction.reaction === button.customId).function(number) > cmdTemplates.length || reactions.find(findreaction => findreaction.reaction === button.customId).function(number) < 1) {
                            button.deferUpdate().catch(() => { })
                            return
                        }
                        number = reactions.find(findreaction => findreaction.reaction === button.customId).function(number)
                        cmdEmbed = cmdTemplates[number - 1]
                        helpMessage.edit({
                            embeds: [cmdEmbed],
                            components: [buttonRow, importButtonRow]
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
                            embeds: [cmdEmbed],
                            components: []
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

            register: async (msg, args) => {
                await createCommand(msg, args)
            },

            add: async (msg, args) => {
                await createCommand(msg, args)
            },

            edit: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify the ID!').catch(() => { })
                    return
                }

                var id = args[1].replace(/#/g, '')
                var command = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].find(cmd => cmd.id === id)
                var commandIndex = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].findIndex(cmd => cmd.id === id)

                if (command && commandIndex > -1) {
                    if (command.creator !== msg.author.id) {
                        msg.channel.send(`idiot you didn't make that command`).catch(() => { })
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
                            msg.channel.send('Not a valid image URL.').catch(() => { })
                            return
                        }
                    }

                    var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)

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
                        var findCommand = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].find(cmd => cmd.name === params.name && cmd.creator === msg.author.id)

                        if (findCommand) {
                            msg.channel.send(`You've already created a command with that name! (ID: \`${findCommand.id}\`)`).catch(() => { })
                            return
                        }
                    }

                    for (var param in params) {
                        poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'][commandIndex][param] = params[param]
                    }

                    msg.channel.send(`✅ Command successfully updated.`).catch(() => { })
                } else {
                    msg.channel.send('Not a valid ID.').catch(() => { })
                }
            },

            delete: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify the ID!').catch(() => { })
                    return
                }

                var id = args[1].replace(/#/g, '')
                var command = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].find(cmd => cmd.id === id)
                var commandIndex = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].findIndex(cmd => cmd.id === id)

                if (command && commandIndex > -1) {
                    if (command.creator !== msg.author.id) {
                        msg.channel.send(`idiot you didn't make that command`).catch(() => { })
                        return
                    }

                    poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commandTemplates'].splice(commandIndex, 1)

                    msg.channel.send(`✅ Command successfully deleted.`).catch(() => { })
                } else {
                    msg.channel.send('Not a valid ID.').catch(() => { })
                }
            },
        }

        if (!args[1]) {
            msg.channel.send({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**list** - Sends an navigable embed with a list of all command templates made by the users of Poopy.\n\n**search** <query> - Searches for every command in the command database that matches the query.\n\n**register**/**add** <name> <phrase> {-description <text>} [-image <url>] [-syntax <text>] - Registers the command with the respective name, description and syntax (if supplied), it'll then be assigned an ID that can be used to import it via the `localcmds` command.\n\n**edit** <id> [-name <text>] [-phrase <text>] [-description <text>] [-image <url>] [-syntax <text>] - Allows you to edit the command with the respective ID in the database, if it exists and you made it.\n\n**delete** <id> - Permanently deletes the command from the database with the respective ID, if it exists and YOU made it.",
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
        name: 'commandtemplates/cmdtemplates <option>',
        value: 'Gives you access to a global database of command templates you can use in your servers! Anyone can contribute to it.\n' +
            'fun fact: this was made because im too lazy to add commands myself haha\n' +
            '\n' +
            '**list** - Sends an navigable embed with a list of all command templates made by the users of Poopy.\n' +
            '\n' +
            '**search** <query> - Searches for every command in the command database that matches the query.\n' +
            '\n' +
            "**register**/**add** <name> <phrase> {-description <text>} [-image <url>] [-syntax <text>] - Registers the command with the respective name, description and syntax (if supplied), it'll then be assigned an ID that can be used to import it via the `localcmds` command.\n" +
            '\n' +
            '**edit** <id> [-name <text>] [-phrase <text>] [-description <text>] [-image <url>] [-syntax <text>] - Allows you to edit the command with the respective ID in the database, if it exists and you made it.\n' +
            '\n' +
            '**delete** <id> - Permanently deletes the command from the database with the respective ID, if it exists and YOU made it.'
    },
    cooldown: 5000,
    type: 'Unique'
}