module.exports = {
    name: ['messages'],
    execute: async function (msg, args) {
        let poopy = this

        var options = {
            list: async (msg) => {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/messagelist.txt`, poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/messagelist.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            },

            search: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify the query!').catch(() => { })
                    return
                }

                var saidMessage = args.join(' ').substring(args[0].length + 1)
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var results = []

                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'].forEach(message => {
                    if (message.toLowerCase().includes(cleanMessage.toLowerCase())) {
                        results.push(message)
                    }
                })

                if (results.length) {
                    results.sort((a, b) => Math.abs(1 - poopy.functions.similarity(a.toLowerCase(), cleanMessage.toLowerCase())) - Math.abs(1 - poopy.functions.similarity(b.toLowerCase(), cleanMessage.toLowerCase())))
                }

                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/messagelist.txt`, results.join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/messagelist.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            },

            random: async (msg) => {
                msg.channel.send(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'][Math.floor(Math.random() * poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'].length)]).catch(() => { })
            },

            add: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify the message!').catch(() => { })
                    return
                }

                var saidMessage = args.join(' ').substring(args[0].length + 1)
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var findMessage = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'].find(message => message.toLowerCase() === cleanMessage.toLowerCase())

                if (findMessage) {
                    msg.channel.send(`That message already exists.`).catch(() => { })
                    return
                } else {
                    var send = true

                    if (cleanMessage.match(/nigg|https?\:\/\/.*(rule34|e621|pornhub|hentaihaven|xxx|iplogger|discord\.gg\/[\d\w]+\/?$|discord\.gift)/ig)) {
                        send = await poopy.functions.yesno(msg.channel, 'That message looks dangerous, are you sure about this?', msg.member.id).catch(() => { }) ?? false
                    }

                    var messages = [cleanMessage].concat(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'])
                    messages.splice(1000)
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'] = messages

                    msg.channel.send({
                        content: `✅ Added ${cleanMessage}`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                }
            },

            delete: async (msg, args) => {
                if (!args[1]) {
                    msg.channel.send('You gotta specify the message!').catch(() => { })
                    return
                }

                var saidMessage = args.join(' ').substring(args[0].length + 1)
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var findMessage = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'].findIndex(message => message.toLowerCase() === cleanMessage.toLowerCase())

                if (findMessage > -1) {
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'].splice(findMessage, 1)

                    msg.channel.send(`✅ Removed.`).catch(() => { })
                } else {
                    msg.channel.send(`Not found.`).catch(() => { })
                }
            },

            clear: async (msg) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    var confirm = await poopy.functions.yesno(msg.channel, 'are you sure about this', msg.member).catch(() => { })

                    if (confirm) {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages'] = []

                        msg.channel.send(`✅ All the messages from the database have been cleared.`).catch(() => { })
                    }
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                };
            },

            read: async (msg) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read'] = !(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read'])

                    var read = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read']
                    msg.channel.send(`I **can${!read ? '\'t' : ''} read** messages from the channel now.`).catch(() => { })
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                    return;
                };
            },

            readall: async (msg) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['read'] = !(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['read'])
                    var channels = msg.guild.channels.cache

                    channels.forEach(channel => {
                        if (channel.isText()) {
                            if (!poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][channel.id]) {
                                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][channel.id] = {}
                            }

                            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][channel.id]['read'] = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['read']
                        }
                    })

                    var read = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['read']
                    msg.channel.send(`I **can${!read ? '\'t' : ''} read** messages from all channels now.`).catch(() => { })
                } else {
                    msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            if (poopy.config.textEmbeds) msg.channel.send("**list** - Sends a text file with a list of all messages that exist within the guild's message database.\n\n**search** <query> - Searches for every message in the server that matches the query.\n\n**random** - Sends a random message from the database to the channel.\n\n**add** <message> - Adds a new message to the guild's database, if it is available for use.\n\n**delete** <message> - Deletes the message, if it exists.\n\n**clear** (admin only) - Clears ALL the messages from the database.\n\n**read** (admin only) - Toggles whether the bot can read the messages from the channel or not.\n\n**readall** (admin only) - Toggles whether the bot can read the messages from all channels or not.").catch(() => { })
            else msg.channel.send({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**list** - Sends a text file with a list of all messages that exist within the guild's message database.\n\n**search** <query> - Searches for every message in the server that matches the query.\n\n**random** - Sends a random message from the database to the channel.\n\n**add** <message> - Adds a new message to the guild's database, if it is available for use.\n\n**delete** <message> - Deletes the message, if it exists.\n\n**clear** (admin only) - Clears ALL the messages from the database.\n\n**read** (admin only) - Toggles whether the bot can read the messages from the channel or not.\n\n**readall** (admin only) - Toggles whether the bot can read the messages from all channels or not.",
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
        name: 'messages <option>',
        value: "Allows you to see or manage the server's message database. Used by the `_message` keyword and has a 1000 messages limit. Use the command alone for more info."
    },
    cooldown: 2500,
    type: 'Unique'
}