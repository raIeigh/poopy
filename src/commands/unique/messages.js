module.exports = {
    name: ['messages'],
    args: [{
        "name": "option",
        "required": true,
        "specifarg": false,
        "orig": "<option>"
    }],
    subcommands: [{
        "name": "list",
        "args": [],
        "description": "Sends a text file with a list of all messages that exist within the guild's message database."
    },
    {
        "name": "search",
        "args": [{
            "name": "query",
            "required": true,
            "specifarg": false,
            "orig": "<query>"
        }],
        "description": "Searches for every message in the server that matches the query."
    },
    {
        "name": "random",
        "args": [],
        "description": "Sends a random message from the database to the channel."
    },
    {
        "name": "member",
        "args": [{
            "name": "id",
            "required": true,
            "specifarg": false,
            "orig": "<id>",
            "autocomplete": function (interaction) {
                let poopy = this

                var memberData = poopy.data.guildData[interaction.guild.id]['allMembers']
                var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

                return memberKeys.map(id => {
                    return {
                        name: memberData[id].username, value: id
                    }
                })
            }
        }],
        "description": "Sends a random message from that member to the channel."
    },
    {
        "name": "add",
        "args": [{
            "name": "message",
            "required": true,
            "specifarg": false,
            "orig": "<message>"
        }],
        "description": "Adds a new permanent message to the guild's database, if it is not duplicated."
    },
    {
        "name": "delete",
        "args": [{
            "name": "message",
            "required": true,
            "specifarg": false,
            "orig": "<message>",
            "autocomplete": function (interaction) {
                let poopy = this
                let { decrypt } = poopy.functions
                return poopy.data.guildData[interaction.guild.id]['messages'].map(msg => decrypt(msg.content))
            }
        }],
        "description": "Deletes the message, if it exists."
    },
    {
        "name": "clear",
        "args": [],
        "description": "Clears ALL the messages from the database."
    },
    {
        "name": "read",
        "args": [],
        "description": "Toggles whether the bot can read the messages from the channel or not."
    },
    {
        "name": "readall",
        "args": [],
        "description": "Toggles whether the bot can read the messages from all channels or not."
    }],
    execute: async function (msg, args) {
        let poopy = this
        let vars = poopy.vars
        let config = poopy.config
        let { fs, Discord, DiscordTypes, CryptoJS } = poopy.modules
        let data = poopy.data
        let { similarity, yesno, decrypt, dataGather } = poopy.functions
        let bot = poopy.bot

        var options = {
            list: async (msg) => {
                var currentcount = vars.filecount
                vars.filecount++
                var filepath = `temp/${config.database}/file${currentcount}`
                fs.mkdirSync(`${filepath}`)
                fs.writeFileSync(`${filepath}/messagelist.txt`, data.guildData[msg.guild.id]['messages'].map(m => `Author: ${m.author}\n${decrypt(m.content)}`).join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
                if (!msg.nosend) await msg.reply({
                    files: [new Discord.AttachmentBuilder(`${filepath}/messagelist.txt`)]
                }).catch(() => { })
                fs.rm(`${filepath}`, {
                    force: true, recursive: true
                })
                return data.guildData[msg.guild.id]['messages'].map(m => `Author: ${m.author}\n${decrypt(m.content)}`).join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing'
            },

            search: async (msg, args) => {
                if (!args[1]) {
                    await msg.reply('You gotta specify the query!').catch(() => { })
                    return
                }

                var saidMessage = args.slice(1).join(' ')
                var cleanMessage = Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var results = []

                data.guildData[msg.guild.id]['messages'].forEach(message => {
                    if (decrypt(message.content).toLowerCase().includes(cleanMessage.toLowerCase())) {
                        results.push(message)
                    }
                })

                if (results.length) {
                    results.sort((a, b) => Math.abs(1 - similarity(decrypt(a.content).toLowerCase(), cleanMessage.toLowerCase())) - Math.abs(1 - similarity(decrypt(b.content).toLowerCase(), cleanMessage.toLowerCase())))
                }

                var currentcount = vars.filecount
                vars.filecount++
                var filepath = `temp/${config.database}/file${currentcount}`
                fs.mkdirSync(`${filepath}`)
                fs.writeFileSync(`${filepath}/messagelist.txt`, results.map(m => `Author: ${m.author}\n${decrypt(m.content)}`).join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
                if (!msg.nosend) await msg.reply({
                    files: [new Discord.AttachmentBuilder(`${filepath}/messagelist.txt`)]
                }).catch(() => { })
                fs.rm(`${filepath}`, {
                    force: true, recursive: true
                })
                return results.map(m => `Author: ${m.author}\n${decrypt(m.content)}`).join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing'
            },

            random: async (msg) => {
                var messages = data.guildData[msg.guild.id]['messages']

                if (!messages.length) {
                    await msg.reply('No messages!').catch(() => { })
                    return
                }

                var rand = decrypt(messages[Math.floor(Math.random() * messages.length)].content)
                if (!msg.nosend) await msg.reply(rand).catch(() => { })
                return rand
            },

            member: async (msg, args) => {
                if (args[1] === undefined) {
                    await msg.reply('Who is the member?!').catch(() => { })
                    return
                }

                args[1] = args[1] ?? ''

                var member = await bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => { })

                var messages = data.guildData[msg.guild.id]['messages'].filter(m => m.author == member.id)

                if (!messages.length) {
                    await msg.reply('No messages!').catch(() => { })
                    return
                }

                var rand = decrypt(messages[Math.floor(Math.random() * messages.length)].content)
                if (!msg.nosend) await msg.reply(rand).catch(() => { })
                return rand
            },

            add: async (msg, args) => {
                if (!args[1]) {
                    await msg.reply('You gotta specify the message!').catch(() => { })
                    return
                }

                var saidMessage = args.slice(1).join(' ')
                var cleanMessage = Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var findMessage = data.guildData[msg.guild.id]['messages'].find(message => decrypt(message.content).toLowerCase() === cleanMessage.toLowerCase())

                if (findMessage) {
                    await msg.reply(`That message already exists.`).catch(() => { })
                    return
                } else {
                    var send = true

                    if (cleanMessage.match(/nigg|fagg|https?\:\/\/.*(rule34|e621|pornhub|hentaihaven|xxx|iplogger|discord\.gg\/[\d\w]+\/?$|discord\.gift)/ig)) {
                        send = msg.nosend || await yesno(msg.channel, 'That message looks nasty, are you sure about this?', msg.member.id, undefined, msg).catch(() => { })
                    }

                    if (!send) return

                    var messages = [{
                        author: msg.author.id,
                        content: CryptoJS.AES.encrypt(cleanMessage, process.env.AUTH_TOKEN).toString(),
                        timestamp: Number.MAX_SAFE_INTEGER // genius
                    }].concat(data.guildData[msg.guild.id]['messages'])
                    messages.splice(10000)
                    data.guildData[msg.guild.id]['messages'] = messages

                    if (!msg.nosend) await msg.reply({
                        content: `✅ Added ${cleanMessage}`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    return `✅ Added ${cleanMessage}`
                }
            },

            delete: async (msg, args) => {
                if (!args[1]) {
                    await msg.reply('You gotta specify the message!').catch(() => { })
                    return
                }

                var saidMessage = args.slice(1).join(' ')
                var cleanMessage = Discord.Util.cleanContent(saidMessage, msg).replace(/\@/g, '@‌')
                var findMessage = data.guildData[msg.guild.id]['messages'].findIndex(message => decrypt(message.content).toLowerCase() === cleanMessage.toLowerCase())

                if (findMessage > -1) {
                    data.guildData[msg.guild.id]['messages'].splice(findMessage, 1)

                    if (!msg.nosend) await msg.reply(`✅ Removed.`).catch(() => { })
                    return `✅ Removed.`
                } else {
                    await msg.reply(`Not found.`).catch(() => { })
                }
            },

            clear: async (msg) => {
                if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
                    var confirm = msg.nosend || await yesno(msg.channel, 'are you sure about this', msg.member, undefined, msg).catch(() => { })

                    if (confirm) {
                        data.guildData[msg.guild.id]['messages'] = []

                        if (!msg.nosend) await msg.reply(`✅ All the messages from the database have been cleared.`).catch(() => { })
                        return `✅ All the messages from the database have been cleared.`
                    }
                } else {
                    await msg.reply('You need the manage server permission to execute that!').catch(() => { })
                };
            },

            read: async (msg) => {
                if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
                    data.guildData[msg.guild.id]['channels'][msg.channel.id]['read'] = !(data.guildData[msg.guild.id]['channels'][msg.channel.id]['read'])

                    var read = data.guildData[msg.guild.id]['channels'][msg.channel.id]['read']
                    if (!msg.nosend) await msg.reply(`I **can${!read ? '\'t' : ''} read** messages from the channel now.`).catch(() => { })
                    return `I **can${!read ? '\'t' : ''} read** messages from the channel now.`
                } else {
                    await msg.reply('You need to be a moderator to execute that!').catch(() => { })
                    return;
                };
            },

            readall: async (msg) => {
                if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
                    data.guildData[msg.guild.id]['read'] = !(data.guildData[msg.guild.id]['read'])
                    var channels = [...msg.guild.channels.cache.values()]
                    var channelData = !config.testing && process.env.MONGOOSE_URL && await dataGather.allChannelData(config.database, msg.guild.id).catch(() => { }) || {}

                    for (var channel of channels) {
                        if (channel.type === DiscordTypes.ChannelType.GuildText || channel.type === DiscordTypes.ChannelType.GuildNews) {
                            if (!data.guildData[msg.guild.id]['channels'][channel.id]) {
                                data.guildData[msg.guild.id]['channels'][channel.id] = channelData[channel.id] || {}
                            }

                            data.guildData[msg.guild.id]['channels'][channel.id]['read'] = data.guildData[msg.guild.id]['read']
                        }
                    }

                    var read = data.guildData[msg.guild.id]['read']
                    if (!msg.nosend) await msg.reply(`I **can${!read ? '\'t' : ''} read** messages from all channels now.`).catch(() => { })
                    return `I **can${!read ? '\'t' : ''} read** messages from all channels now.`
                } else {
                    await msg.reply('You need the manage server permission to execute that!').catch(() => { })
                    return;
                };
            },
        }

        if (!args[1]) {
            var instruction = "**list** - Sends a text file with a list of all messages that exist within the guild's message database.\n\n**search** <query> - Searches for every message in the server that matches the query.\n\n**random** - Sends a random message from the database to the channel.\n\n**member** <id> - Sends a random message from that member to the channel.\n\n**add** <message> - Adds a new permanent message to the guild's database, if it is not duplicated.\n\n**delete** <message> - Deletes the message, if it exists.\n\n**clear** (manage server only) - Clears ALL the messages from the database.\n\n**read** (moderator only) - Toggles whether the bot can read the messages from the channel or not.\n\n**readall** (manage server only) - Toggles whether the bot can read the messages from all channels or not."
            if (!msg.nosend) {
                if (config.textEmbeds) msg.reply(instruction).catch(() => { })
                else msg.reply({
                    embeds: [{
                        "title": "Available Options",
                        "description": instruction,
                        "color": 0x472604,
                        "footer": {
                            "icon_url": bot.user.displayAvatarURL({
                                dynamic: true, size: 1024, extension: 'png'
                            }),
                            "text": bot.user.username
                        },
                    }]
                }).catch(() => { })
            }
            return instruction
        }

        if (!options[args[1].toLowerCase()]) {
            await msg.reply('Not a valid option.').catch(() => { })
            return
        }

        return await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'messages <option>',
        value: "Allows you to see or manage the server's message database. Used by the `_message` keyword and has a 10k messages limit. They're auto-deleted after 30 days to abide with Discord's TOS, unless added manually. Use the command alone for more info."
    },
    cooldown: 2500,
    raw: true,
    type: 'Unique'
}