module.exports = {
    name: ['messages'],
    args: [{"name":"option","required":true,"specifarg":false,"orig":"<option>"}],
    execute: async function (msg, args) {
        let poopy = this

        var options = {
            list: async (msg) => {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/messagelist.txt`, poopy.data['guild-data'][msg.guild.id]['messages'].map(m => `Author: ${m.author}\n${m.content}`).join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/messagelist.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            },

            search: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('You gotta specify the query!').catch(() => { })
                    return
                }

                var saidMessage = args.slice(1).join(' ')
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var results = []

                poopy.data['guild-data'][msg.guild.id]['messages'].forEach(message => {
                    if (message.content.toLowerCase().includes(cleanMessage.toLowerCase())) {
                        results.push(message)
                    }
                })

                if (results.length) {
                    results.sort((a, b) => Math.abs(1 - poopy.functions.similarity(a.content.toLowerCase(), cleanMessage.toLowerCase())) - Math.abs(1 - poopy.functions.similarity(b.content.toLowerCase(), cleanMessage.toLowerCase())))
                }

                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/messagelist.txt`, results.map(m => `Author: ${m.author}\n${m.content}`).join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/messagelist.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            },

            random: async (msg) => {
                await msg.channel.send(poopy.data['guild-data'][msg.guild.id]['messages'][Math.floor(Math.random() * poopy.data['guild-data'][msg.guild.id]['messages'].length)].content).catch(() => { })
            },

            add: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('You gotta specify the message!').catch(() => { })
                    return
                }

                var saidMessage = args.slice(1).join(' ')
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var findMessage = poopy.data['guild-data'][msg.guild.id]['messages'].find(message => message.content.toLowerCase() === cleanMessage.toLowerCase())

                if (findMessage) {
                    await msg.channel.send(`That message already exists.`).catch(() => { })
                    return
                } else {
                    var send = true

                    if (cleanMessage.match(/nigg|https?\:\/\/.*(rule34|e621|pornhub|hentaihaven|xxx|iplogger|discord\.gg\/[\d\w]+\/?$|discord\.gift)/ig)) {
                        send = await poopy.functions.yesno(msg.channel, 'That message looks nasty, are you sure about this?', msg.member.id).catch(() => { }) ?? false
                    }

                    var messages = [{
                        author: msg.author.id,
                        content: cleanMessage
                    }].concat(poopy.data['guild-data'][msg.guild.id]['messages'])
                    messages.splice(10000)
                    poopy.data['guild-data'][msg.guild.id]['messages'] = messages

                    await msg.channel.send({
                        content: `✅ Added ${cleanMessage}`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                }
            },

            delete: async (msg, args) => {
                if (!args[1]) {
                    await msg.channel.send('You gotta specify the message!').catch(() => { })
                    return
                }

                var saidMessage = args.slice(1).join(' ')
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var findMessage = poopy.data['guild-data'][msg.guild.id]['messages'].findIndex(message => message.content.toLowerCase() === cleanMessage.toLowerCase())

                if (findMessage > -1) {
                    poopy.data['guild-data'][msg.guild.id]['messages'].splice(findMessage, 1)

                    await msg.channel.send(`✅ Removed.`).catch(() => { })
                } else {
                    await msg.channel.send(`Not found.`).catch(() => { })
                }
            },

            clear: async (msg) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    var confirm = await poopy.functions.yesno(msg.channel, 'are you sure about this', msg.member).catch(() => { })

                    if (confirm) {
                        poopy.data['guild-data'][msg.guild.id]['messages'] = []

                        await msg.channel.send(`✅ All the messages from the database have been cleared.`).catch(() => { })
                    }
                } else {
                    await msg.channel.send('You need the manage server permission to execute that!').catch(() => { })
                };
            },

            read: async (msg) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read'] = !(poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read'])

                    var read = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read']
                    await msg.channel.send(`I **can${!read ? '\'t' : ''} read** messages from the channel now.`).catch(() => { })
                } else {
                    await msg.channel.send('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },

            readall: async (msg) => {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    poopy.data['guild-data'][msg.guild.id]['read'] = !(poopy.data['guild-data'][msg.guild.id]['read'])
                    var channels = msg.guild.channels.cache

                    channels.forEach(channel => {
                        if (channel.isText()) {
                            if (!poopy.data['guild-data'][msg.guild.id]['channels'][channel.id]) {
                                poopy.data['guild-data'][msg.guild.id]['channels'][channel.id] = {}
                            }

                            poopy.data['guild-data'][msg.guild.id]['channels'][channel.id]['read'] = poopy.data['guild-data'][msg.guild.id]['read']
                        }
                    })

                    var read = poopy.data['guild-data'][msg.guild.id]['read']
                    await msg.channel.send(`I **can${!read ? '\'t' : ''} read** messages from all channels now.`).catch(() => { })
                } else {
                    await msg.channel.send('You need the manage server permission to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            if (poopy.config.textEmbeds) msg.channel.send("**list** - Sends a text file with a list of all messages that exist within the guild's message database.\n\n**search** <query> - Searches for every message in the server that matches the query.\n\n**random** - Sends a random message from the database to the channel.\n\n**add** <message> - Adds a new message to the guild's database, if it is available for use.\n\n**delete** <message> - Deletes the message, if it exists.\n\n**clear** (manage server only) - Clears ALL the messages from the database.\n\n**read** (moderator only) - Toggles whether the bot can read the messages from the channel or not.\n\n**readall** (manage server only) - Toggles whether the bot can read the messages from all channels or not.").catch(() => { })
            else msg.channel.send({
                embeds: [
                    {
                        "title": "Available Options",
                        "description": "**list** - Sends a text file with a list of all messages that exist within the guild's message database.\n\n**search** <query> - Searches for every message in the server that matches the query.\n\n**random** - Sends a random message from the database to the channel.\n\n**add** <message> - Adds a new message to the guild's database, if it is available for use.\n\n**delete** <message> - Deletes the message, if it exists.\n\n**clear** (manage server only) - Clears ALL the messages from the database.\n\n**read** (moderator only) - Toggles whether the bot can read the messages from the channel or not.\n\n**readall** (manage server only) - Toggles whether the bot can read the messages from all channels or not.",
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
        name: 'messages <option>',
        value: "Allows you to see or manage the server's message database. Used by the `_message` keyword and has a 10k messages limit. Use the command alone for more info."
    },
    cooldown: 2500,
    type: 'Unique'
}