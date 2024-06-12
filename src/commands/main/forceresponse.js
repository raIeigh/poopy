module.exports = {
    name: ['forceresponse'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message<_msg>>"},{"name":"persist","required":false,"specifarg":true,"orig":"[-persist]"}],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let tempdata = poopy.tempdata
        let { getOption } = poopy.functions

        if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
            var persist = getOption(args, 'persist', { dft: false, splice: true, n: 0 })
            if (args[1] === undefined) {
                await msg.reply('You must specify the response!').catch(() => { })
                return
            }
            for (var i in args) {
                var arg = args[i]
                if (arg == '') {
                    args.splice(i, 1)
                }
            }
            var saidMessage = args.slice(1).join(' ')

            if (!msg.nosend) await msg.reply({
                content: `OK, the bot's next message${persist ? 's' : ''} here will be "${saidMessage}"`,
                allowedMentions: {
                    parse: ['users']
                }
            }).catch(() => { })
            tempdata[msg.guild.id][msg.channel.id]['forceres'] = {
                persist,
                msg,
                res: saidMessage
            }
            return `OK, the bot's next message${persist ? 's' : ''} here will be "${saidMessage}"`
        } else {
            await msg.reply('You need to be a moderator to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'forceresponse <message<_msg>> [-persist] (moderator only)',
        value: "Forces the bot's next response(s) to be the one supplied. Why? It's funny"
    },
    cooldown: 5000,
    perms: ['Administrator', 'ManageMessages'],
    type: 'Main',
    raw: true,
    hivemindForce: true
}