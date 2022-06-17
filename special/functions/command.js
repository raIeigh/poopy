module.exports = {
    helpf: '(name | arguments) (manage messages only)',
    desc: 'Allows you to execute any command!',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var commandname = (split[0] ?? '').toLowerCase()
        var args = split[1] ?? ''
        var command = poopy.commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === commandname))
        var localCommand = poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)
        var error = ''

        if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return ''

        if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 &&
                poopy.tempdata[msg.author.id]['cooler'] !== msg.id) {
                return `Calm down! Wait more ${(poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        poopy.tempdata[msg.author.id]['cooler'] = msg.id

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id) || isBot) {
            if (command || localCommand) {
                if (poopy.data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                    return 'This command is disabled in this server.'
                } else {
                    var msgclone = msg

                    msgclone.content = `${poopy.data['guild-data'][msg.guild.id]['prefix']}${commandname} ${args}`

                    await poopy.functions.getUrls(msgclone, {
                        string: msgclone.content,
                        update: true
                    }).catch(() => { })

                    if (command) {
                        var increaseCount = !(command.execute.toString().includes('sendFile') && args.includes('-nosend'))

                        if (increaseCount) {
                            if (poopy.tempdata[msg.author.id][msg.id]['execCount'] >= 1 && poopy.data['guild-data'][msg.guild.id]['chaincommands'] == false && !(msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot)) return 'You can\'t chain commands in this server.'
                            if (poopy.tempdata[msg.author.id][msg.id]['execCount'] >= poopy.config.commandLimit * ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)) return `Number of commands to run at the same time must be smaller or equal to **${poopy.config.commandLimit * ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)}**!`
                            poopy.tempdata[msg.author.id][msg.id]['execCount']++
                        }

                        if (command.cooldown) {
                            poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                        }

                        poopy.vars.cps++
                        poopy.data['bot-data']['commands']++
                        var t = setTimeout(() => {
                            poopy.vars.cps--;
                            clearTimeout(t)
                        }, 1000)

                        poopy.functions.infoPost(`Command \`${commandname}\` used`)
                        await poopy.functions.waitMessageCooldown()
                        var url = await command.execute.call(this, msgclone, [commandname].concat(args.split(' ')), { ownermode: opts.ownermode }).catch(err => {
                            error = err.stack
                        })
                        poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                        return url ?? error
                    } else if (localCommand) {
                        poopy.vars.cps++
                        poopy.data['bot-data']['commands']++
                        var t = setTimeout(() => {
                            poopy.vars.cps--;
                            clearTimeout(t)
                        }, 60000)
                        poopy.functions.infoPost(`Command \`${commandname}\` used`)
                        var oopts = { ...opts }
                        oopts.ownermode = localCommand.ownermode || oopts.ownermode
                        var phrase = await poopy.functions.getKeywordsFor(localCommand.phrase, msgclone, true, oopts).catch(() => { }) ?? 'error'
                        poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                        return phrase
                    }
                }
            } else {
                return 'Invalid command.'
            }
        } else {
            return 'You need to have the manage messages permission to execute that!'
        }

        return error
    },
    attemptvalue: 10
}