module.exports = {
    name: ['setprefix'],
    args: [{"name":"prefix","required":true,"specifarg":false,"orig":"<prefix>"}],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let data = poopy.data

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
            if (args[1] === undefined) {
                await msg.reply('You must specify a prefix!').catch(() => { })
                return
            }
            for (var i in args) {
                var arg = args[i]
                if (arg == '') {
                    args.splice(i, 1)
                }
            }
            var saidMessage = args.slice(1).join(' ').split(/[\s]+/).join(' ')
            if (saidMessage.length > 20) {
                await msg.reply('The prefix can\'t be bigger than 20 characters.').catch(() => { })
                return
            }
            data['guild-data'][msg.guild.id]['prefix'] = saidMessage
            await msg.reply(`The prefix was set to \`${saidMessage}\` (if this is wrong, mention me with "reset prefix")`).catch(() => { })
        } else {
            await msg.reply('You need to be a moderator to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'setprefix <prefix> (moderator only)',
        value: "Set Poopy's prefix to anything you want.\n" +
            'Pro Tip: mentioning Poopy with "reset prefix" will reset it to his default prefix.'
    },
    cooldown: 5000,
    perms: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    type: 'Settings'
}