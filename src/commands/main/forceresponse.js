module.exports = {
    name: ['forceresponse'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"}],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let data = poopy.data

        if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
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
                content: `OK, the bot's next message here will be "${saidMessage}"`,
                allowedMentions: {
                    parse: ['users']
                }
            }).catch(() => { })
            tempdata[msg.guild.id][msg.channel.id]['forceres'] = saidMessage
            return `OK, the bot's next message here will be "${saidMessage}"`
        } else {
            await msg.reply('You need to be a moderator to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: '<:newpoopy:839191885310066729> forceresponse <message> (moderator only)',
        value: "Forces the bot's next response to be the one supplied. Why? It's funny"
    },
    cooldown: 5000,
    perms: ['Administrator', 'ManageMessages'],
    type: 'Main'
}