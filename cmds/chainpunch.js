module.exports = {
    name: ['chainpunch'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[1] === undefined && attachments.length <= 0) {
            msg.channel.send('What/who is the subject?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        if ((Math.floor(Math.random() * 2)) === 0) {
            var damage = Math.floor(Math.random() * 18) + 6;
            if (!msg.mentions.members.size) {
                async function getMember(id) {
                    var member = await poopy.bot.users.fetch(id)
                        .catch(function () {
                            msg.channel.send({
                                content: '<@' + msg.author.id + '> chain punched **' + (saidMessage || 'this') + '**! It did **' + damage + '** damage!',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                },
                                files: attachments
                            }).catch(() => { })
                            msg.channel.sendTyping().catch(() => { })
                        })

                    if (member) {
                        saidMessage = member.username
                        msg.channel.send({
                            content: '<@' + msg.author.id + '> chain punched **' + (saidMessage || 'this') + '**! It did **' + damage + '** damage!',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            },
                            files: attachments
                        }).catch(() => { })
                        if (!poopy.data[poopy.config.mongodatabase]['user-data'][member.id]) {
                            poopy.data[poopy.config.mongodatabase]['user-data'][member.id] = {}
                            poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = 100
                        }
                        poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] - damage
                        if (poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] <= 0) {
                            poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = 100
                            msg.channel.send({
                                content: '**' + member.username + '** died!',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                            msg.channel.sendTyping().catch(() => { })
                            return
                        }
                        msg.channel.sendTyping().catch(() => { })
                    }
                }

                getMember(saidMessage);
            }
            else {
                var member = msg.mentions.members.first()
                saidMessage = member.user.username
                msg.channel.send({
                    content: '<@' + msg.author.id + '> chain punched **' + (saidMessage || 'this') + '**! It did **' + damage + '** damage!',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    },
                    files: attachments
                }).catch(() => { })
                if (!poopy.data[poopy.config.mongodatabase]['user-data'][member.id]) {
                    poopy.data[poopy.config.mongodatabase]['user-data'][member.id] = {}
                    poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = 100
                }
                poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] - damage
                if (poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] <= 0) {
                    poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = 100
                    msg.channel.send({
                        content: '**' + member.user.username + '** died!',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                    return
                }
            }
        } else {
            msg.channel.send('You missed!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
        }
    },
    help: {
        name: 'chainpunch <subject>',
        value: 'Chain punch something! Does random damage, and has a pretty high chance to miss.'
    },
    type: 'Battling'
}