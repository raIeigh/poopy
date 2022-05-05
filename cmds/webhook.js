module.exports = {
    name: ['webhook', 'customhook', 'customwebhook'],
    execute: async function (msg, args) {
        let poopy = this

        if (msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
            var user = args[1]
            if (args[1] === undefined || (args[1] ? (args[1].startsWith('"') || poopy.vars.validUrl.test(args[1])) : false)) {
                user = msg.author.id
            }
            var userMention = msg.mentions.members.first()

            if (!userMention) {
                async function getUser(id) {
                    await msg.guild.members.fetch(id)
                        .then(async function (user) {
                            if (!poopy.data['guild-data'][msg.guild.id]) {
                                poopy.data['guild-data'][msg.guild.id] = {}
                            }
                            if (!poopy.data['guild-data'][msg.guild.id]['members'][user.id]) {
                                poopy.data['guild-data'][msg.guild.id]['members'][user.id] = {}
                            }
                            if (!poopy.data['guild-data'][msg.guild.id]['members'][user.id]['custom']) {
                                poopy.data['guild-data'][msg.guild.id]['members'][user.id]['custom'] = false
                            }
                            if (poopy.data['guild-data'][msg.guild.id]['members'][user.id]['custom'] === false) {
                                var saidMessage = args.join(' ').substring(args[0].length + 1)
                                var symbolReplacedMessage
                                poopy.vars.symbolreplacements.forEach(symbolReplacement => {
                                    symbolReplacement.target.forEach(target => {
                                        symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                                    })
                                })
                                var matchedTextes = symbolReplacedMessage.match(/"([\s\S]*?)"/)
                                if (!matchedTextes) {
                                    msg.channel.send('Where\'s the name?!').catch(() => { })
                                    return
                                }
                                if (!poopy.vars.validUrl.test(args[args.length - 1])) {
                                    msg.channel.send('Where\'s the avatar?!').catch(() => { })
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
                                    msg.channel.send('Invalid name.').catch(() => { })
                                    return
                                }
                                var fetchAvatar = await poopy.modules.axios.request({
                                    url: args[args.length - 1],
                                    responseType: 'stream'
                                }).catch(() => { })
                                if (!fetchAvatar) {
                                    msg.channel.send('Invalid avatar.').catch(() => { })
                                    return
                                }
                                var avatarFiletype = await poopy.modules.fileType.fromStream(fetchAvatar.data).catch(() => { })
                                if (!avatarFiletype) {
                                    msg.channel.send('Invalid avatar.').catch(() => { })
                                    return
                                }
                                if (!(avatarFiletype.mime.startsWith('image'))) {
                                    msg.channel.send('Invalid avatar.').catch(() => { })
                                    return
                                }
                                var avatar = args[args.length - 1]

                                poopy.data['guild-data'][msg.guild.id]['members'][user.id]['custom'] = {
                                    name: allBlank ? '⠀' : name,
                                    avatar: avatar
                                }
                                msg.channel.send({
                                    content: user.user.username + ` is now ${name}.`,
                                    allowedMentions: {
                                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                    }
                                }).catch(() => { })
                            } else {
                                msg.channel.send({
                                    content: user.user.username + ` is not ${poopy.data['guild-data'][msg.guild.id]['members'][user.id]['custom']['name']}.`,
                                    allowedMentions: {
                                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                    }
                                }).catch(() => { })
                                poopy.data['guild-data'][msg.guild.id]['members'][user.id]['custom'] = false
                            }
                        })
                        .catch(function () {
                            msg.channel.send({
                                content: 'Invalid user ID: **' + user + '**',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        })
                }

                getUser(user)
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
                    var saidMessage = args.join(' ').substring(args[0].length + 1)
                    var symbolReplacedMessage
                    poopy.vars.symbolreplacements.forEach(symbolReplacement => {
                        symbolReplacement.target.forEach(target => {
                            symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                        })
                    })
                    var matchedTextes = symbolReplacedMessage.match(/"([\s\S]*?)"/)
                    if (!matchedTextes) {
                        msg.channel.send('Where\'s the name?!').catch(() => { })
                        return
                    }
                    if (!poopy.vars.validUrl.test(args[args.length - 1])) {
                        msg.channel.send('Where\'s the avatar?!').catch(() => { })
                        return
                    }
                    var name = matchedTextes[1]
                    var fetchAvatar = await poopy.modules.axios.request({
                        url: args[args.length - 1],
                        responseType: 'stream'
                    }).catch(() => { })
                    if (!fetchAvatar) {
                        msg.channel.send('Invalid avatar.').catch(() => { })
                        return
                    }
                    var avatarFiletype = await poopy.modules.fileType.fromStream(fetchAvatar.data).catch(() => { })
                    if (!avatarFiletype) {
                        msg.channel.send('Invalid avatar.').catch(() => { })
                        return
                    }
                    if (!(avatarFiletype.mime.startsWith('image'))) {
                        msg.channel.send('Invalid avatar.').catch(() => { })
                        return
                    }
                    var avatar = args[args.length - 1]

                    poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom'] = {
                        name: name,
                        avatar: avatar
                    }
                    msg.channel.send({
                        content: userMention.user.username + ` is now ${name}.`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                } else {
                    msg.channel.send({
                        content: userMention.user.username + ` is not ${poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom']['name']}.`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    poopy.data['guild-data'][msg.guild.id]['members'][userMention.id]['custom'] = false
                }
            }
        } else {
            msg.channel.send('You need to have the manage webhooks permission to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'webhook/customhook/customwebhook [user] "<text>" <image> (manage webhooks permission only)',
        value: 'Turns someone into the webhook you specified.'
    },
    cooldown: 2500,
    perms: ['ADMINISTRATOR', 'MANAGE_WEBHOOKS'],
    type: 'Webhook'
}