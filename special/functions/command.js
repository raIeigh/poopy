module.exports = {
    helpf: '(name | arguments)',
    desc: 'Allows you to execute any command!',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, getUrls, infoPost, getKeywordsFor } = poopy.functions
        let globaldata = poopy.globaldata
        let commands = poopy.commands
        let data = poopy.data
        let tempdata = poopy.tempdata
        let config = poopy.config
        let vars = poopy.vars

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var commandname = (split[0] ?? '').toLowerCase()
        var args = split[1] ?? ''
        var command = commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === commandname))
        var localCommand = data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === commandname)
        var error = ''

        if (tempdata[msg.guild.id][msg.channel.id]['shut']) return ''

        if (globaldata['bot-data']['shit'].find(id => id === msg.author.id)) return 'shit'

        if (data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 &&
                tempdata[msg.author.id]['cooler'] !== msg.id) {
                return `Calm down! Wait more ${(data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        tempdata[msg.author.id]['cooler'] = msg.id

            if (command || localCommand) {
                if (data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === commandname))) {
                    return 'This command is disabled in this server.'
                } else {
                    var content = msg.content

                    msg.content = `${data['guild-data'][msg.guild.id]['prefix']}${commandname} ${args}`

                    await getUrls(msg, {
                        string: msg.content,
                        update: true
                    }).catch(() => { })

                    if (command) {
                        var increaseCount = !(command.execute.toString().includes('sendFile') && args.includes('-nosend'))

                        if (increaseCount) {
                            if (tempdata[msg.author.id][msg.id]['execCount'] >= 1 && data['guild-data'][msg.guild.id]['chaincommands'] == false && !(msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot)) {
                                msg.content = content
                                return 'You can\'t chain commands in this server.'
                            }
                            if (tempdata[msg.author.id][msg.id]['execCount'] >= config.commandLimit * ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)) {
                                msg.content = content
                                return `Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)}**!`
                            }
                            tempdata[msg.author.id][msg.id]['execCount']++
                        }

                        if (command.cooldown) {
                            data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + command.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (command.type === 'Text' || command.type === 'Main') ? 5 : 1)
                        }

                        vars.cps++
                        data['bot-data']['commands']++
                        var t = setTimeout(() => {
                            vars.cps--;
                            clearTimeout(t)
                        }, 1000)

                        infoPost(`Command \`${commandname}\` used`)
                        await command.execute.call(poopy, msg, [commandname].concat(args.split(' ')), { ownermode: opts.ownermode }).catch(err => {
                            error = err.stack
                        })
                        data['bot-data']['filecount'] = vars.filecount
                        msg.content = content
                    } else if (localCommand) {
                        vars.cps++
                        data['bot-data']['commands']++
                        var t = setTimeout(() => {
                            vars.cps--;
                            clearTimeout(t)
                        }, 60000)
                        infoPost(`Command \`${commandname}\` used`)
                        var oopts = { ...opts }
                        oopts.ownermode = localCommand.ownermode || oopts.ownermode
                        var phrase = await getKeywordsFor(localCommand.phrase, msg, true, oopts).catch(() => { }) ?? 'error'
                        data['bot-data']['filecount'] = vars.filecount
                        msg.content = content
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