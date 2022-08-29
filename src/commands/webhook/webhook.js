module.exports = {
    name: ['webhook',
        'customhook',
        'customwebhook'],
    args: [{
        "name": "user",
        "required": false,
        "specifarg": false,
        "orig": "[user]"
    },
        {
            "name": "text",
            "required": true,
            "specifarg": false,
            "orig": "\"<text>\""
        },
        {
            "name": "image",
            "required": true,
            "specifarg": false,
            "orig": "<image>"
        }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let data = poopy.data
        let {
            axios,
            fileType
        } = poopy.modules

        args[1] = args[1] ?? ''

        var member = msg.mentions.members.first() ??
        await msg.guild.members.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
        msg.member

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
            return
        }

        if (!data['guild-data'][msg.guild.id]) {
            data['guild-data'][msg.guild.id] = {}
        }
        if (!data['guild-data'][msg.guild.id]['members'][member.id]) {
            data['guild-data'][msg.guild.id]['members'][member.id] = {}
        }
        if (!data['guild-data'][msg.guild.id]['members'][member.id]['custom']) {
            data['guild-data'][msg.guild.id]['members'][member.id]['custom'] = false
        }
        if (data['guild-data'][msg.guild.id]['members'][member.id]['custom'] === false) {
            if (msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
                var saidMessage = args.slice(1).join(' ')
                var symbolReplacedMessage
                vars.symbolreplacements.forEach(symbolReplacement => {
                    symbolReplacement.target.forEach(target => {
                        symbolReplacedMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
                    })
                })
                var matchedTextes = symbolReplacedMessage.match(/"([\s\S]*?)"/)
                if (!matchedTextes) {
                    await msg.reply('Where\'s the name?!').catch(() => {})
                    return
                }
                if (!vars.validUrl.test(args[args.length - 1])) {
                    await msg.reply('Where\'s the avatar?!').catch(() => {})
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
                    await msg.reply('Invalid name.').catch(() => {})
                    return
                }
                var fetchAvatar = await axios.request({
                    url: args[args.length - 1],
                    responseType: 'stream'
                }).catch(() => {})
                if (!fetchAvatar) {
                    await msg.reply('Invalid avatar.').catch(() => {})
                    return
                }
                var avatarFiletype = await fileType.fromStream(fetchAvatar.data).catch(() => {})
                if (!avatarFiletype) {
                    await msg.reply('Invalid avatar.').catch(() => {})
                    return
                }
                if (!(avatarFiletype.mime.startsWith('image'))) {
                    await msg.reply('Invalid avatar.').catch(() => {})
                    return
                }
                var avatar = args[args.length - 1]

                data['guild-data'][msg.guild.id]['members'][member.id]['custom'] = {
                    name: allBlank ? '⠀': name,
                    avatar: avatar
                }
                await msg.reply({
                    content: member.user.username + ` is now ${name}.`,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => {})
            } else {
                await msg.reply('You need to have the manage webhooks/messages permission to execute that!').catch(() => {})
                return;
            }
        } else {
            await msg.reply({
                content: member.user.username + ` is not ${data['guild-data'][msg.guild.id]['members'][member.id]['custom']['name']}.`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
            data['guild-data'][msg.guild.id]['members'][member.id]['custom'] = false
        }
    },
    help: {
        name: 'webhook/customhook/customwebhook [user] "<text>" <image> (manage webhooks/messages permission only)',
        value: 'Turns someone into the webhook you specified.'
    },
    cooldown: 2500,
    perms: ['ADMINISTRATOR',
        'MANAGE_WEBHOOKS',
        'MANAGE_MESSAGES'],
    type: 'Webhook'
}