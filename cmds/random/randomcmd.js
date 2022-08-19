module.exports = {
    name: ['randomcmd'],
    args: [{"name":"args","required":false,"specifarg":false,"orig":"[args]"},{"name":"cmdtype","required":false,"specifarg":true,"orig":"[-cmdtype <commandType>]"}],
    execute: async function (msg, args) {
        let poopy = this

        var type
        var allCmds = poopy.commands.concat(poopy.data['guild-data'][msg.guild.id]['localcmds'].map(lcmd => {
            return {
                name: [lcmd.name],
                type: 'Local',
                execute: async () => await poopy.functions.getKeywordsFor(lcmd.phrase, msg, true, { resetattempts: true, ownermode: lcmd.ownermode }).catch(() => { }) ?? 'error'
            }
        }))

        function chooseCmd() {
            if (type) {
                var foundCmds = []
                for (var i in allCmds) {
                    var cmd = allCmds[i]
                    if (cmd.type === type && !(cmd.type === 'Owner' || cmd.type === 'JSON Club' || cmd.perms || poopy.data['guild-data'][msg.guild.id]['disabled'].find(c => c.find(n => n === cmd.name.find(nn => nn === n))))) {
                        foundCmds.push(cmd)
                    }
                }

                if (foundCmds.length) {
                    return foundCmds[Math.floor(Math.random() * foundCmds.length)]
                }

                return allCmds[Math.floor(Math.random() * allCmds.length)]
            } else {
                var cmd = allCmds[Math.floor(Math.random() * allCmds.length)]
                if (cmd.type === 'Owner' || cmd.type === 'JSON Club' || cmd.perms || poopy.data['guild-data'][msg.guild.id]['disabled'].find(c => c.find(n => n === cmd.name.find(nn => nn === n)))) {
                    return chooseCmd()
                }
                return cmd
            }
        }

        var typeindex = args.indexOf('-cmdtype')
        if (typeindex > -1) {
            if (poopy.vars.types.find(type => type.toLowerCase() === args.slice(typeindex + 1).join(' ').toLowerCase())) {
                type = poopy.vars.types.find(type => type.toLowerCase() === args.slice(typeindex + 1).join(' ').toLowerCase())
                args.splice(typeindex)
            }
        }

        var cmd = chooseCmd()

        if (!cmd) {
            await msg.reply('there is no dog').catch(() => { })
            return
        }

        var cmdmessage = await msg.reply(`Executing \`${cmd.name[0]}\`.`).catch(() => { })
        if (cmd.cooldown) {
            poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + cmd.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (cmd.type === 'Text' || cmd.type === 'Main') ? 5 : 1)
        }

        var deletetimeout = setTimeout(() => {
            if (!cmdmessage) return
            cmdmessage.delete().catch(() => { })
            clearTimeout(deletetimeout)
        }, 3000)

        var phrase = await cmd.execute.call(poopy, msg, args).catch(() => { }) ?? 'error'
        if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return
        if (cmd.type == 'Local') {
            await msg.reply({
                content: phrase,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
    },
    help: {
        name: 'randomcmd [args] [-cmdtype <commandType>]',
        value: 'Executes a completely random Poopy command.\n' +
            'Example usage: p:randomcmd -cmdtype Local'
    },
    cooldown: 2500,
    type: 'Random'
}