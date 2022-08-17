module.exports = {
    name: ['slap'],
    args: [{"name":"subject","required":true,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[1] === undefined && attachments.length <= 0) {
            await msg.channel.send('What/who is the subject?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        if ((Math.floor(Math.random() * 3)) > 0) {
            if (!msg.mentions.members.size) {
                async function getMember(id) {
                    var member = await poopy.bot.users.fetch(id)
                        .catch(async () => {
                            await msg.channel.send({
                                content: '<@' + msg.author.id + '> slapped **' + (saidMessage || 'this') + '**! It did **5** damage!',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                },
                                files: attachments
                            }).catch(() => { })
                            await msg.channel.sendTyping().catch(() => { })
                        })

                    if (member) {
                        saidMessage = member.username
                        await msg.channel.send({
                            content: '<@' + msg.author.id + '> slapped **' + (saidMessage || 'this') + '**! It did **5** damage!',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            },
                            files: attachments
                        }).catch(() => { })
                        if (!poopy.data['user-data'][member.id]) {
                            poopy.data['user-data'][member.id] = {}
                            poopy.data['user-data'][member.id]['health'] = 100
                        }
                        poopy.data['user-data'][member.id]['health'] = poopy.data['user-data'][member.id]['health'] - 10
                        if (poopy.data['user-data'][member.id]['health'] <= 0) {
                            poopy.data['user-data'][member.id]['health'] = 100
                            await msg.channel.send({
                                content: '**' + member.username + '** died!',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                            await msg.channel.sendTyping().catch(() => { })
                            return
                        }
                        await msg.channel.sendTyping().catch(() => { })
                    }
                }

                await getMember(saidMessage);
            }
            else {
                var member = msg.mentions.members.first()
                saidMessage = member.user.username
                await msg.channel.send({
                    content: '<@' + msg.author.id + '> slapped **' + (saidMessage || 'this') + '**! It did **5** damage!',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    },
                    files: attachments
                }).catch(() => { })
                if (!poopy.data['user-data'][member.id]) {
                    poopy.data['user-data'][member.id] = {}
                    poopy.data['user-data'][member.id]['health'] = 100
                }
                poopy.data['user-data'][member.id]['health'] = poopy.data['user-data'][member.id]['health'] - 10
                if (poopy.data['user-data'][member.id]['health'] <= 0) {
                    poopy.data['user-data'][member.id]['health'] = 100
                    await msg.channel.send({
                        content: '**' + member.user.username + '** died!',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                }
                await msg.channel.sendTyping().catch(() => { })
            }
        } else {
            await msg.channel.send('You missed!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
        }
    },
    help: {
        name: 'slap <subject>',
        value: 'Slap something! Has a small chance of missing.'
    },
    type: 'Battling'
}