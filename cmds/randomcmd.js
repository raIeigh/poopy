module.exports = {
    name: ['randomcmd'],
    execute: async function (msg, args) {
        let poopy = this

        var type = 'Rand'
        function chooseCmd() {
            var cmd
            if (type === 'Rand') {
                cmd = poopy.commands[Math.floor(Math.random() * poopy.commands.length)]
                if (cmd.type === 'Owner' || cmd.type === 'JSON Club' || cmd.perms || poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['disabled'].find(c => c.find(n => n === cmd.name.find(nn => nn === n)))) {
                    return chooseCmd()
                }
                return cmd
            } else {
                var cmds = []
                for (var i in poopy.vars.shelpCmds) {
                    var shelpCmd = poopy.vars.shelpCmds[i]
                    if (shelpCmd.type === type) {
                        for (var j in shelpCmd.commands) {
                            var command = shelpCmd.commands[j]
                            var cmd = poopy.commands.find(c => c.help.name === command.name)
                            if (!(cmd.type === 'Owner' || cmd.type === 'JSON Club' || cmd.perms || poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['disabled'].find(c => c.find(n => n === cmd.name.find(nn => nn === n))))) {
                                cmds.push(cmd)
                            }
                        }
                    }
                }
                if (cmds.length > 0) {
                    cmd = cmds[Math.floor(Math.random() * cmds.length)]
                    return cmd
                }
                return
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
            msg.channel.send('no').catch(() => { })
            return
        }

        var cmdmessage = await msg.channel.send(`Executing \`${cmd.name[0]}\`.`).catch(() => { })
        if (cmd.cooldown) {
            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + cmd.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (cmd.type === 'Text' || cmd.type === 'Main') ? 5 : 1)
        }
        var deletetimeout = setTimeout(() => {
            if (!cmdmessage) return
            cmdmessage.delete().catch(() => { })
            clearTimeout(deletetimeout)
        }, 3000)
        await cmd.execute.call(this, msg, args)
    },
    help: {
        name: 'randomcmd [args] [-cmdtype <commandType>]',
        value: 'Executes a completely random Poopy command.\n' +
            'Example usage: p:randomcmd -cmdtype File Manipulation'
    },
    cooldown: 2500,
    type: 'Random'
}