module.exports = {
    helpf: '(name | arguments)',
    desc: 'Allows you to execute any command!',
    func: async function (matches, msg, _, string) {
        let poopy = this

        var f = matches[0]
        var word = matches[1]

        var commandMatch = string.match(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'))
        if (commandMatch ? commandMatch.length > poopy.config.commandLimit : false) return `Can't use the command function more than ${poopy.config.commandLimit} times.`
        var split = poopy.functions.splitKeyFunc(word)
        var commandname = (split[0] ?? '').toLowerCase()
        var args = split.slice(1).length ? split.slice(1).join(' | ') : ''
        var command = poopy.commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === commandname))
        var localCommand = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)
        var error = ''

        if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return ''

        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0) {
                return `Calm down! Wait more ${(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        if (poopy.config.shit.find(id => id === msg.author.id)) {
            return 'shit'
        }

        if (command || localCommand) {
            if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                msg.channel.send('This command is disabled in this server.').catch(() => { })
            } else {
                var msgclone = msg

                msgclone.content = `${commandname} ${args}`

                await poopy.functions.getUrls(msgclone, {
                    string: args,
                    update: true
                }).catch(err => msg.channel.send({
                    content: err.message,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { }))

                if (command) {
                    if (command.cooldown) {
                        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                    }

                    poopy.vars.cps++
                    poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commands']++
                    var t = setTimeout(() => {
                        poopy.vars.cps--;
                        clearTimeout(t)
                    }, 1000)

                    poopy.functions.infoPost(`Command \`${commandname}\` used`)
                    await command.execute.call(this, msgclone, [commandname].concat(args.split(' '))).catch(err => {
                        error = err.stack
                    })
                    poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['filecount'] = poopy.vars.filecount
                } else if (localCommand) {
                    poopy.vars.cps++
                    poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commands']++
                    var t = setTimeout(() => {
                        poopy.vars.cps--;
                        clearTimeout(t)
                    }, 60000)
                    poopy.functions.infoPost(`Command \`${commandname}\` used`)
                    var phrase = await poopy.functions.getKeywordsFor(localCommand.phrase, msg, true).catch(() => { }) ?? 'error'
                    poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['filecount'] = poopy.vars.filecount
                    return phrase
                }
            }
        } else {
            return 'Invalid command.'
        }

        return error
    },
    attemptvalue: 10
}