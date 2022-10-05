module.exports = {
    name: ['react'],
    args: [{ "name": "emojis", "required": true, "specifarg": false, "orig": "<emojis>" }, { "name": "messageid", "required": false, "specifarg": false, "orig": "{messageid}" }],
    execute: async function (msg, args) {
        let poopy = this
        let { Discord } = poopy.modules

        if (args[1] === undefined) {
            await msg.reply('Where are the arguments?!').catch(() => { })
            return;
        }
        var saidEmojis = args[1];
        var saidMessage = args[2];

        if (saidMessage === undefined) {
            saidMessage = msg.id
        }

        if (saidEmojis) {
            var emojisArray = saidEmojis.split(',')
            var messageToReact = await msg.channel.messages.fetch(saidMessage)
                .catch(async () => {
                    await msg.reply({
                        content: 'Invalid message id: **' + saidMessage + '**',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    return
                })

            if (!messageToReact) return

            for (var emoji of emojisArray) {
                var err = false
                messageToReact.react(emoji).catch(() => err = true)
                if (err) {
                    await msg.reply({
                        content: 'Invalid emoji: **' + emoji + '**',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    return
                }
            }

            if (msg.type === Discord.InteractionType.ApplicationCommand && !msg.replied) {
                await msg.reply({ content: 'Successfully reacted.', ephemeral: true }).catch(() => { })
            }
        };
    },
    help: {
        name: 'react <emojis> {messageid}',
        value: 'React to a message inside the channel with an emoji. (each emoji should be separated with ",")'
    },
    type: 'Main'
}