module.exports = {
    name: ['react'],
    execute: async function (msg, args) {
        let poopy = this

        if (args[1] === undefined) {
            msg.channel.send('Where are the arguments?!').catch(() => { })
            return;
        }
        msg.channel.sendTyping().catch(() => { })
        var saidEmojis = args[1];
        var saidMessage = args[2];

        if (saidMessage === undefined) {
            saidMessage = msg.id
        }

        if (saidEmojis) {
            var saidEmojisArray = saidEmojis.split(',');
            saidEmojisArray.forEach(
                saidEmoji => {
                    async function getMessage(id) {
                        var messageToReact = await msg.channel.messages.fetch(id)
                            .catch(function () {
                                msg.channel.send({
                                    content: 'Invalid message id: **' + id + '**',
                                    allowedMentions: {
                                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                    }
                                }).catch(() => { })
                                msg.channel.sendTyping().catch(() => { })
                                return
                            })

                        if (messageToReact) {
                            messageToReact.react(saidEmoji)
                                .then(function () {
                                    msg.channel.sendTyping().catch(() => { })
                                })
                                .catch(function () {
                                    msg.channel.send({
                                        content: 'Invalid emoji: **' + saidEmoji + '**',
                                        allowedMentions: {
                                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                        }
                                    }).catch(() => { })
                                    msg.channel.sendTyping().catch(() => { })
                                    return;
                                })
                        }
                    }

                    getMessage(saidMessage)
                }
            )
        };
    },
    help: {
        name: 'react <emojis> {messageid}',
        value: 'React to a message inside the channel with an emoji. (each emoji should be separated with ",")'
    },
    type: 'Main'
}