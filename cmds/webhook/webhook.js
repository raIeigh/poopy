module.exports = {
    name: ['webhook', 'customhook', 'customwebhook'],
    args: [{"name":"user","required":false,"specifarg":false,"orig":"[user]"},{"name":"text","required":true,"specifarg":false,"orig":"\"<text>\""},{"name":"image","required":true,"specifarg":false,"orig":"<image>"}],
    execute: async function (msg, args) {
        let poopy = this

        if (msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
            var user = args[1]
            if (args[1] === undefined || (args[1] ? (args[1].startsWith('"') || poopy.vars.validUrl.test(args[1])) : false)) {
                user = msg.author.id
            }
            var userMention = msg.mentions.members.first()

            if (!userMention) {
                async function getUser(id) {
                    var member = await msg.guild.members.fetch(id).catch(async () => {
                        await msg.channel.send({
                            content: 'Invalid user ID: **' + id + '**',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    })

                    if (member) {
                        if (!poopy.data['guild-data'][msg.guild.id]) {
                            poopy.data['guild-data'][msg.guild.id] = {}
                        }
                        if (!poopy.data['guild-data'][msg.guild.id]['members'][member.id]) {
                            poopy.data['guild-data'][msg.guild.id]['members'][member.id] = {}
                        }
                        if (!poopy.data['guild-data'][msg.guild.id]['members'][member.id]['custom']) {
                            poopy.data['guild-data'][msg.guild.id]['members'][member.id]['custom'] = false
                        }
                        if (poopy.data['guild-data'][msg.guild.id]['members'][member.id]['custom'] === false) {
                            var saidMessage = args.slice(1).join(' ')
                            var symbolReplacedMessage
                            poopy.vars.symbolreplacements.forEach(symbolReplacement => {
                                symbolReplacement.target.forEach(target => {
                                    symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                                })
                            })
                            var matchedTextes = symbolReplacedMessage.match(/"([\s\S]*?)"/)
                            if (!matchedTextes) {
                                await msg.channel.send('Where\'s the name?!').catch(() => { })
                                return
                            }
                            if (!poopy.vars.validUrl.test(args[args.length - 1])) {
                                await msg.channel.send('Where\'s the avatar?!').catch(() => { })
                                return
                            }
                            var name = matchedTextes[1]
                            var allBlank = true

                            for (var i = 0; i < name.length; i++) {
                                var letter = name[i]
                                if (letter !== ' ') {
                                    allBlank = false
                                }
                            }

                            if (allBlank) {
                                await msg.channel.send('Invalid name.').catch(() => { })
                                return
                            }
                            var fetchAvatar = await poopy.modules.axios.request({
                                url: args[args.length - 1],
                                responseType: 'stream'
                            }).catch(() => { })
                            if (!fetchAvatar) {
                                await msg.channel.send('Invalid avatar.').catch(() => { })
                                return
                            }
                            var avatarFiletype = await poopy.modules.fileType.fromStream(fetchAvatar.data).catch(() => { })
                            if (!avatarFiletype) {
                                await msg.channel.send('Invalid avatar.').catch(() => { })
                                return
                            }
                            if (!(avatarFiletype.mime.startsWith('image'))) {
                                await msg.channel.send('Invalid avatar.').catch(() => { })
                                return
                            }
                            var avatar = args[args.length - 1]

                            poopy.data['guild-data'][msg.guild.id]['members'][member.id]['custom'] = {
                                name: allBlank ? '⠀' : name,
                                avatar: avatar
                            }
                            await msg.channel.send({
                                content: member.user.username + ` is now ${name}.`,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        } else {
                            await msg.channel.send({
                                content: member.user.username + ` is not ${poopy.data['guild-data'][msg.guild.id]['members'][member.id]['custom']['name']}.`,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                            poopy.data['guild-data'][msg.guild.id]['members'][member.id]['custom'] = false
                        }
                    }
                }

                await getUser(user)
            } else {
                if (!poopy.data['guild-data'][msg.guild.id]) {
                    poopy.data['guild-data'][msg.guild.id] = {}
                }
                if (!poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]) {
                    poopy.data['guild-data'][msg.guild.id]['members'][userMention.id] = {}
                }
                if (!poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom']) {
                    poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom'] = false
                }
                if (poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom'] === false) {
                    var saidMessage = args.slice(1).join(' ')
                    var symbolReplacedMessage
                    poopy.vars.symbolreplacements.forEach(symbolReplacement => {
                        symbolReplacement.target.forEach(target => {
                            symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                        })
                    })
                    var matchedTextes = symbolReplacedMessage.match(/"([\s\S]*?)"/)
                    if (!matchedTextes) {
                        await msg.channel.send('Where\'s the name?!').catch(() => { })
                        return
                    }
                    if (!poopy.vars.validUrl.test(args[args.length - 1])) {
                        await msg.channel.send('Where\'s the avatar?!').catch(() => { })
                        return
                    }
                    var name = matchedTextes[1]
                    var fetchAvatar = await poopy.modules.axios.request({
                        url: args[args.length - 1],
                        responseType: 'stream'
                    }).catch(() => { })
                    if (!fetchAvatar) {
                        await msg.channel.send('Invalid avatar.').catch(() => { })
                        return
                    }
                    var avatarFiletype = await poopy.modules.fileType.fromStream(fetchAvatar.data).catch(() => { })
                    if (!avatarFiletype) {
                        await msg.channel.send('Invalid avatar.').catch(() => { })
                        return
                    }
                    if (!(avatarFiletype.mime.startsWith('image'))) {
                        await msg.channel.send('Invalid avatar.').catch(() => { })
                        return
                    }
                    var avatar = args[args.length - 1]

                    poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom'] = {
                        name: name,
                        avatar: avatar
                    }
                    await msg.channel.send({
                        content: userMention.user.username + ` is now ${name}.`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                } else {
                    await msg.channel.send({
                        content: userMention.user.username + ` is not ${poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom']['name']}.`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom'] = false
                }
            }
        } else {
            await msg.channel.send('You need to have the manage webhooks/messages permission to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'webhook/customhook/customwebhook [user] "<text>" <image> (manage webhooks/messages permission only)',
        value: 'Turns someone into the webhook you specified.'
    },
    cooldown: 2500,
    perms: ['ADMINISTRATOR', 'MANAGE_WEBHOOKS', 'MANAGE_MESSAGES'],
    type: 'Webhook'
}