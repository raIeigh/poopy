module.exports = {
    name: ['setprefix'],
    execute: async function (msg, args) {
        let poopy = this

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
            if (args[1] === undefined) {
                msg.channel.send('You must specify a prefix!').catch(() => { })
                return
            }
            for (var i in args) {
                var arg = args[i]
                if (arg == '') {
                    args.splice(i, 1)
                }
            }
            var saidMessage = args.join(' ').substring(args[0].length + 1).split(/[\s]+/).join(' ')
            if (saidMessage.length > 20) {
                msg.channel.send('The prefix can\'t be bigger than 20 characters.').catch(() => { })
                return
            }
            poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['prefix'] = saidMessage
            msg.channel.send(`The prefix was set to \`${poopy.config.globalPrefix}\` (if this is wrong, mention me with "reset prefix")`).catch(() => { })
        } else {
            msg.channel.send('You need to be an administrator to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'setprefix <prefix> (admin only)',
        value: "Set Poopy's prefix to anything you want.\n" +
            'Pro Tip: mentioning Poopy with "reset prefix" will reset it to his default prefix.'
    },
    cooldown: 5000,
    perms: ['ADMINISTRATOR'],
    type: 'Settings'
}