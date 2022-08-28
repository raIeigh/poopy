module.exports = {
    name: ['impostor', 'imposter', 'sus'],
    args: [{"name":"user","required":false,"specifarg":false,"orig":"[user]"}],
    execute: async function (msg, args) {
        let poopy = this
        let data = poopy.data
        let config = poopy.config

        if (!msg.mentions.members.size) {
            var user = args[1]
            if (args[1] === undefined) {
                user = msg.author.id
            }

            async function getUser(id) {
                var user = await msg.guild.members.fetch(id).catch(async () => {
                    await msg.reply({
                        content: 'Invalid user ID: **' + user + '**',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                })

                if (user) {
                    if (!data['guild-data'][msg.guild.id]) {
                        data['guild-data'][msg.guild.id] = {}
                    }
                    if (!data['guild-data'][msg.guild.id]['members'][user.id]) {
                        data['guild-data'][msg.guild.id]['members'][user.id] = {}
                    }
                    if (!data['guild-data'][msg.guild.id]['members'][user.id]['impostor']) {
                        data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] = false
                    }
                    if (data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] === false) {
                        data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] = true
                        await msg.reply({
                            content: user.user.username + ' is now the Impostor.',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        data['guild-data'][msg.guild.id]['members'][user.id]['impostor'] = false
                        await msg.reply({
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
            if (!data['guild-data'][msg.guild.id]) {
                data['guild-data'][msg.guild.id] = {}
            }
            if (!data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]) {
                data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id] = {}
            }
            if (!data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor']) {
                data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] = false
            }
            if (data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] === false) {
                if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
                    data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] = true
                    await msg.reply({
                        content: msg.mentions.members.first().user.username + ' is now the Impostor.',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                } else {
                    await msg.reply('You need to have the manage webhooks/messages permission to execute that!').catch(() => { })
                    return;
                };
            } else {
                data['guild-data'][msg.guild.id]['members'][msg.mentions.members.first().id]['impostor'] = false
                await msg.reply({
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