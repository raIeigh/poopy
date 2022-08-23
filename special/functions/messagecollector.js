module.exports = {
    helpf: '(filter<_msg> | collectPhrase<_msg|resettimer()|stop(sendFinishPhrase)> | timeout | finishPhrase<_collected> | separator) (manage messages permission only)',
    desc: 'Creates a message collector that collects any messages sent in the channel that match the filter, within the timeout.\n' +
        '**_msg** - Keyword used when a message is sent\n' +
        "**resettimer()** - Resets the collector's timer\n" +
        "**stop(sendFinishPhrase)** - Stops the collector from running, sends the finishPhrase if sendFinishPhrase isn't blank.\n" +
        '**_collected** - Used when the collector stops running, containing all collected messages separated with the separator.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 5 })
        var filterString = split[0] ?? ''
        var collectphrase = split[1] ?? ''
        split[2] = await poopy.functions.getKeywordsFor(split[2] ?? '', msg, isBot, opts).catch(() => { }) || ''
        var timeout = isNaN(Number(split[2])) ? 10 : Number(split[2]) <= 1 ? 1 : Number(split[2]) >= 60 ? 60 : Number(split[2]) || 10
        var finishphrase = split[3] ?? ''
        var separator = split[4] ?? ''
        var channel = msg.channel
        var guildid = msg.guild.id
        var channelid = channel.id
        var authorid = msg.author.id

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || authorid === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id) || isBot || authorid == poopy.bot.user.id) {
            if (poopy.tempdata[guildid][channelid][authorid].messageCollector) {
                poopy.tempdata[guildid][channelid][authorid].messageCollector.stop()
                delete poopy.tempdata[guildid][channelid][authorid].messageCollector
            }

            var filter = m => (poopy.config.allowbotusage || !m.author.bot) && m.author.id != poopy.bot.user.id
            var collected = []
            var collector = channel.createMessageCollector({ filter, time: timeout * 1000 })

            poopy.tempdata[guildid][channelid][authorid].messageCollector = collector

            collector.on('collect', async m => {
                try {
                    poopy.functions.dmSupport(m)

                    if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return
                    var content = await poopy.functions.getKeywordsFor(m.content ?? '', m, false).catch(() => { }) ?? m.content

                    var valOpts = { ...opts }
                    valOpts.extrakeys._msg = {
                        func: async () => {
                            return content
                        }
                    }

                    var filterStringM = await poopy.functions.getKeywordsFor(filterString, m, true, valOpts).catch(() => { }) ?? filterString

                    if (filterStringM) {
                        valOpts.extrafuncs.resettimer = {
                            func: async () => {
                                collector.resetTimer()
                                return ''
                            }
                        }
                        valOpts.extrafuncs.stop = {
                            func: async (matches) => {
                                var word = matches[1]
                                collector.stop(word ? 'time' : 'user')
                                return ''
                            }
                        }

                        var collect = await poopy.functions.getKeywordsFor(collectphrase, m, true, valOpts).catch(() => { }) ?? ''

                        collected.push(content)

                        var collectMsg = await channel.send({
                            content: collect,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && authorid !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } catch (_) { }

                poopy.functions.deleteMsgData(m)
            })

            collector.on('end', async (_, reason) => {
                try {
                    if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return
                    delete poopy.tempdata[guildid][channelid][authorid].messageCollector
                    if (reason === 'time') {
                        var valOpts = { ...opts }
                        valOpts.extrakeys._collected = {
                            func: async () => {
                                return collected.join(separator)
                            }
                        }

                        var finishphrasek = await poopy.functions.getKeywordsFor(finishphrase, msg, isBot, valOpts).catch(() => { }) ?? ''

                        var finishMsg = await channel.send({
                            content: finishphrasek,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && authorid !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } catch (_) { }

                poopy.functions.deleteMsgData(msg)
            })

            return ''
        } else {
            return 'You need the manage messages permission to use this function.'
        }
    },
    raw: true,
    potential: {
        keys: { _msg: {}, _collected: {} },
        funcs: { resettimer: {}, stop: {} }
    },
    attemptvalue: 10
}