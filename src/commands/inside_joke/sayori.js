module.exports = {
    name: ['sayori'],
    args: [{ "name": "phraseChoice", "required": false, "specifarg": false, "orig": "[phraseChoice]" }],
    execute: async function (msg, args) {
        let poopy = this
        let bot = poopy.bot
        let { generateSayori } = poopy.functions

        var fixedchoice = args[1];

        var sayori = await bot.users.fetch('758638862590803968')

        var option = generateSayori(msg, fixedchoice)
        var optiontext
        if (option['pings'] === true) {
            optiontext = '<@' + msg.author.id + '> ' + option['text']
        } else {
            optiontext = option['text']
        }

        var botmsg

        var webhooks = await msg.channel.fetchWebhooks().catch(() => { })
        if (webhooks && webhooks.size) {
            var findWebhook = webhooks.find(webhook => bot.user === webhook.owner)
            if (findWebhook) {
                botmsg = await findWebhook.send({
                    content: optiontext,
                    username: sayori.username,
                    avatarURL: sayori.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            } else {
                var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                if (createdWebhook) {
                    botmsg = await createdWebhook.send({
                        content: optiontext,
                        username: sayori.username,
                        avatarURL: sayori.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                }
            }
        } else {
            var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
            if (createdWebhook) {
                botmsg = await createdWebhook.send({
                    content: optiontext,
                    username: sayori.username,
                    avatarURL: sayori.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
            }
        }

        if (botmsg) {
            if (option['edit']) {
                var editTimeout = setTimeout(() => {
                    if (option['pings'] === true) {
                        botmsg.delete().catch(() => { })
                        findWebhook.send({
                            content: '<@' + msg.author.id + '> ' + option['edit'] + ' ⁽ᵉᵈᶦᵗᵉᵈ⁾',
                            username: sayori.username,
                            avatarURL: sayori.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    } else {
                        botmsg.delete().catch(() => { })
                        findWebhook.send({
                            content: option['edit'] + ' ⁽ᵉᵈᶦᵗᵉᵈ⁾',
                            username: sayori.username,
                            avatarURL: sayori.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                    clearTimeout(editTimeout)
                }, 3000)
            }
        } else {
            botmsg = await msg.reply({
                content: optiontext,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })

            if (botmsg) {
                if (option['edit']) {
                    var editTimeout = setTimeout(() => {
                        if (option['pings'] === true) {
                            botmsg.edit({
                                content: '<@' + msg.author.id + '> ' + option['edit'],
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        } else {
                            botmsg.edit({
                                content: option['edit'],
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        }
                        clearTimeout(editTimeout)
                    }, 3000)
                }
            }
        }
    },
    help: { name: 'sayori [phraseChoice]', value: 'no not sayori ai' },
    cooldown: 2500,
    type: 'Inside Joke'
}