module.exports = {
    name: ['impostor', 'imposter', 'sus'],
    args: [{"name":"user","required":false,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        if (!msg.mentions.members.size) {
            var user = args[1]
            if (args[1] === undefined) {
                user = msg.author.id
            }

            async function getUser(id) {
                var user = await msg.guild.members.fetch(id).catch(async () => {
                    await msg.channel.send({
                        content: 'Invalid user ID: **' + user + '**',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                })

                if (user) {
                    if (!poopy.data['guild-data'][msg.guild.id]) {
                        poopy.data['guild-data'][msg.guild.id] = {}
                    }
                    if (!poopy.data['guild-data'][msg.guild.id]['members'][user.id]) {
                        poopy.data['guild-data'][msg.guild.id]['members'][user.id] = {}
                    }
                    if (!poopy.data['guild-data'][msg.guild.id]['members'][user.id]['impostor']) {
                        poopy.data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] = false
                    }
                    if (poopy.data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] === false) {
                        poopy.data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] = true
                        await msg.channel.send({
                            content: user.user.username + ' is now the Impostor.',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        poopy.data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] = false
                        await msg.channel.send({
                            content: user.user.username + ' is not the Impostor.',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                }
            }

            await getUser(user)
        } else {
            if (!poopy.data['guild-data'][msg.guild.id]) {
                poopy.data['guild-data'][msg.guild.id] = {}
            }
            if (!poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]) {
                poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id] = {}
            }
            if (!poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor']) {
                poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] = false
            }
            if (poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] === false) {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
                    poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] = true
                    await msg.channel.send({
                        content: msg.mentions.members.first().user.username + ' is now the Impostor.',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                } else {
                    await msg.channel.send('You need to have the manage webhooks/messages permission to execute that!').catch(() => { })
                    return;
                };
            } else {
                poopy.data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] = false
                await msg.channel.send({
                    content: msg.mentions.members.first().user.username + ' is not the Impostor.',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            }
        }
    },
    help: {
        name: 'impostor/imposter/sus [user] (manage webhooks/messages permission only)',
        value: 'Trap someone in the impostor forcefully'
    },
    cooldown: 2500,
    perms: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    type: 'Webhook'
}