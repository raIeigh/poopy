module.exports = {
    name: ['cleverbot', 'respond'],
    args: [{"name":"message","required":false,"specifarg":false},{"name":"once","required":false,"specifarg":true}],
    execute: async function (msg, args) {
        let poopy = this

        var continuous = true
        var once = args.findIndex(arg => arg === '-once')
        if (once > -1) {
            args.splice(once, 1)
            continuous = false
        }

        var channel = msg.channel
        var guildid = msg.guild.id
        var channelid = channel.id
        var authorid = msg.author.id

        var saidMessage = args.slice(1).join(' ')
        if (saidMessage) {
            var resp = await poopy.functions.cleverbot(saidMessage, authorid).catch(err => {
                channel.send({
                    content: err.stack,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            })

            if (resp) {
                channel.send({
                    content: resp,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            }
        } else {
            if (!continuous && !args[1]) {
                channel.send('What is the message to respond to?!').catch(() => { })
                return
            }
            channel.send('Hello, I will respond to your messages now.').catch(() => { })
        }

        channel.sendTyping().catch(() => { })

        if (continuous) {
            if (poopy.tempdata[guildid][channelid][authorid].messageCollector) {
                poopy.tempdata[guildid][channelid][authorid].messageCollector.stop()
                delete poopy.tempdata[guildid][channelid][authorid].messageCollector
            }

            var filter = m => !m.author.bot && m.author.id != poopy.bot.user.id && m.author.id === msg.author.id
            var collector = channel.createMessageCollector({ filter, time: 30000 })

            poopy.tempdata[guildid][channelid][authorid].messageCollector = collector

            collector.on('collect', async m => {
                await poopy.functions.waitMessageCooldown()
                if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return
                try {
                    var content = await poopy.functions.getKeywordsFor(m.content ?? '', m, false).catch(() => { }) ?? m.content

                    collector.resetTimer()

                    var resp = await poopy.functions.cleverbot(content, channelid).catch(err => {
                        channel.send({
                            content: err.stack,
                            allowedMentions: {
                                parse: ((!m.member.permissions.has('ADMINISTRATOR') && !m.member.permissions.has('MENTION_EVERYONE') && m.author.id !== m.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    })
                    if (resp) {
                        channel.send({
                            content: resp,
                            allowedMentions: {
                                parse: ((!m.member.permissions.has('ADMINISTRATOR') && !m.member.permissions.has('MENTION_EVERYONE') && m.author.id !== m.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } catch (_) { }
            })

            collector.on('end', async (_, reason) => {
                await poopy.functions.waitMessageCooldown()
                if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return
                try {
                    delete poopy.tempdata[guildid][channelid][authorid].messageCollector
                    if (reason === 'time') {
                        channel.send({
                            content: 'I\'m running out of time...',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && authorid !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } catch (_) { }
            })
        }
    },
    help: {
        name: 'cleverbot/respond {message} [-once]',
        value: "Poopy responds to your messages with Cleverbot's AI. Try it yourself at https://www.cleverbot.com/"
    },
    type: 'Text'
}