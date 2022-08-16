module.exports = {
    name: ['react'],
    execute: async function (msg, args) {
        let poopy = this

        if (args[1] === undefined) {
            await msg.channel.send('Where are the arguments?!').catch(() => { })
            return;
        }
        var saidEmojis = args[1];
        var saidMessage = args[2];

        if (saidMessage === undefined) {
            saidMessage = msg.id
        }

        if (saidEmojis) {
            var saidEmojisArray = saidEmojis.split(',');
            saidEmojisArray.forEach(async saidEmoji => {
                async function getMessage(id) {
                    var messageToReact = await msg.channel.messages.fetch(id)
                        .catch(async () => {
                            await msg.channel.send({
                                content: 'Invalid message id: **' + id + '**',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                            return
                        })

                    if (messageToReact) {
                        messageToReact.react(saidEmoji)
                            .catch(async () => {
                                await msg.channel.send({
                                    content: 'Invalid emoji: **' + saidEmoji + '**',
                                    allowedMentions: {
                                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                    }
                                }).catch(() => { })
                                return;
                            })
                    }
                }

                await getMessage(saidMessage)
            })
        };
    },
    help: {
        name: 'react <emojis> {messageid}',
        value: 'React to a message inside the channel with an emoji. (each emoji should be separated with ",")'
    },
    type: 'Main'
}