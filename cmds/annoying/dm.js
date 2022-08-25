module.exports = {
    name: ['dm'],
    args: [{
        "name": "user",
        "required": true,
        "specifarg": false,
        "orig": "<user>",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data['guild-data'][interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    },
        {
            "name": "message",
            "required": true,
            "specifarg": false,
            "orig": "<message>"
        },
        {
            "name": "anonymous",
            "required": false,
            "specifarg": true,
            "orig": "[-anonymous]"
        }],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => {})
        args = poopy.functions.splitKeyFunc(args.join(' '), { separator: ' ' })
        args[1] = await poopy.functions.getKeywordsFor(args[1], msg, false).catch(() => { }) ?? 'error'
        if (args[1] === undefined) {
            await msg.reply('Who do I DM?!').catch(() => {})
            return;
        };
        var anon = false
        var anonIndex = args.indexOf('-anonymous')
        if (anonIndex > -1) {
            args.splice(anonIndex, 1)
            anon = true
        }
        var saidMessage = args.slice(2).join(' ')
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[2] === undefined && attachments.length <= 0) {
            await msg.reply('What is the message to DM?!').catch(() => {})
            return;
        };

        if (args[1].match(/^@(here|everyone)$/) && saidMessage === 'egg' && (msg.member.permissions.has('ADMINISTRATOR') || msg.member.permissions.has('MENTION_EVERYONE') || msg.author.id == msg.guild.ownerID)) {
            var ha = poopy.functions.shuffle([...msg.guild.emojis.cache.values()].map(e => `<${e.animated ? 'a': ''}:${e.name}:${e.id}>`)).slice(0, 25)
            var he = poopy.functions.shuffle(poopy.json.emojiJSON.map(e => e.emoji)).slice(0, 25 - ha.length)
            var hi = poopy.functions.shuffle(ha.concat(he))
            var ho = hi.map(e => {
                return {
                    emoji: e,
                    reactemoji: e,
                    customid: e,
                    style: poopy.functions.randomChoice(['PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER']),
                    resolve: false
                }
            })
            var hu = poopy.functions.randomChoice(ho)
            hu.resolve = true
            console.log(ho)

            var haa = await poopy.functions.yesno(msg.channel, `It's time to choose the wise one`, msg.member, ho, undefined, msg).catch(() => {})

            if (haa) {
                poopy.data['user-data'][msg.author.id]['health'] = Number.MAX_SAFE_INTEGER
                await msg.reply(`***YES!!🥳🥳🥳🥳🎉🎉*** *YES !!!!!* **THAT'S THE** __*Only Thing You Need From The Doctor*__, the ${hu.emoji}.🎉🎉🎉🎉🎉🎉 ***AND*** *NOW* YOUHAVE, __*100% Fresh Juiced from Florida*__, __***\`${Number.MAX_SAFE_INTEGER} HEALTH\`***__ *FOREVER*👍`).catch(() => {})
            } else {
                await msg.reply('invalid').catch(() => {})
            }
            return
        }

        args[1] = args[1] ?? ''

        var member = (msg.mentions.members.first() && msg.mentions.members.first().user) ??
        await poopy.bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {})

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
            return
        }

        if (!poopy.data['user-data'][member.id]) {
            poopy.data['user-data'][member.id] = {}
        }
        if (!poopy.tempdata[member.id]) {
            poopy.tempdata[member.id] = {}
        }

        if (poopy.data['user-data'][member.id]['dms'] === undefined && !poopy.tempdata[member.id]['dmconsent'] && member.id != msg.author.id) {
            poopy.tempdata[msg.author.id]['dmconsent'] = true

            var pending = await msg.reply('Pending response.').catch(() => {})
            var send = await poopy.functions.yesno(member, `${!anon ? msg.author.tag: 'Someone'} is trying to send you a message. Will you consent to any unrelated DMs sent with the \`dm\` command?`, member.id).catch(() => {})

            if (send !== undefined) {
                poopy.data['user-data'][member.id]['dms'] = send
                member.send({
                    content: `Unrelated DMs from \`dm\` will **${!send ? 'not ': ''}be sent** to you now.`,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => {})
                if (pending) {
                    pending.edit(send ? 'You can send DMs to the user now.': 'blocked on twitter').catch(() => {})
                }
            } else {
                pending.edit('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => {})
            }
        } else {
            if (poopy.data['user-data'][member.id]['dms'] === false && member.id != msg.author.id) {
                await msg.reply('I don\'t have the permission to send unrelated DMs to this user.').catch(() => {})
                return
            }

            var channel = msg.channel
            var guild = msg.guild

            var dmChannel = await member.createDM().catch(() => { })
            dmChannel.onsfw = !!dmChannel.nsfw
            dmChannel.nsfw = !!poopy.data['guild-data'][dmChannel.id]?.['channels']?.[dmChannel.id]?.['nsfw']

            Object.defineProperty(msg, 'channel', { value: dmChannel, writable: true })
            Object.defineProperty(msg, 'guild', { value: new poopy.vars.dmGuild(msg), writable: true })

            poopy.functions.dmSupport(msg)

            saidMessage = await poopy.functions.getKeywordsFor(saidMessage, msg, false).catch(() => { }) ?? 'error'
            
            Object.defineProperty(msg, 'channel', { value: channel })
            Object.defineProperty(msg, 'guild', { value: guild })
            
            dmChannel.send({
                content: `${!anon ? `${msg.author.tag} from ${msg.guild.name}:\n\n`: ''}${saidMessage}`,
                files: attachments
            }).then(async () => {
                msg.react('✅').catch(() => {})
            }).catch(async () => {
                await msg.reply(member.id == msg.author.id ? 'unblock me': 'Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => {})
                return
            })
        }
    },
    help: {
        name: 'dm <user> <message> [-anonymous]',
        value: 'Allows Poopy to DM an user the message inside the command.'
    },
    raw: true,
    type: 'Annoying'
}