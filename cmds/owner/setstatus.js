module.exports = {
    name: ['setstatus', 'ss'],
    args: [{ "name": "type", "required": true, "specifarg": false, "orig": "<type (STREAMING, WATCHING, PLAYING, LISTENING or COMPETING)>", "autocomplete": [
        'PLAYING',
        'LISTENING',
        'WATCHING',
        'STREAMING',
        'COMPETING'
    ] }, { "name": "statusMessage", "required": true, "specifarg": false, "orig": "<statusMessage>" }, { "name": "permanent", "required": false, "specifarg": true, "orig": "[-permanent]" }],
    execute: async function (msg, args, opts) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.reply('Owner only!').catch(() => { })
            return
        } else {
            var permanent = !!poopy.functions.getOption(args, 'permanent', { splice: true, dft: false })

            if (args[1] === undefined) {
                await msg.reply('What is the status type?! (Available: **PLAYING**, **LISTENING**, **WATCHING**, **STREAMING**, **COMPETING**)').catch(() => { })
                return;
            }

            if (args[2] === undefined) {
                await msg.reply('What is the status message?!').catch(() => { })
                return;
            }

            if (args[1] === 'PLAYING' || args[1] === 'LISTENING' || args[1] === 'WATCHING' || args[1] === 'STREAMING' || args[1] === 'COMPETING') {
                var saidMessage = args.slice(2).join(' ')
                await msg.channel.sendTyping().catch(() => { })
                poopy.functions.infoPost(`Status changed to ${args[1].toLowerCase() + ' ' + ((args[1] === "COMPETING" && 'in ') || (args[1] === "LISTENING" && 'to ') || '') + saidMessage}`)
                poopy.bot.user.setPresence({
                    status: 'online',
                    activities: [
                        {
                            name: saidMessage + ` | ${poopy.config.globalPrefix}help`,
                            type: args[1],
                            url: 'https://www.youtube.com/watch?v=LDQO0ALm0gE'
                        }
                    ],
                });
                poopy.vars.statusChanges = permanent;
                await msg.reply({
                    content: 'Poopy\'s status set to: **' + saidMessage + ' (' + args[1] + ')**',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
            }
            else {
                await msg.reply({
                    content: 'Invalid status type: **' + args[2] + '** (Available: **PLAYING**, **LISTENING**, **WATCHING**, **STREAMING**, **COMPETING**)',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
            }
        };
    },
    help: {
        name: 'setstatus/ss <type (STREAMING, WATCHING, PLAYING, LISTENING or COMPETING)> <statusMessage> [-permanent]',
        value: 'Allows Poopy to have a custom status.\n' +
            'Example usage: p:setstatus STREAMING you, idiot. -permanent'
    },
    cooldown: 2500,
    type: 'Owner'
}