module.exports = {
    helpf: '(name | avatar | message) (manage webhooks/messages only)',
    desc: 'Creates a webhook with the name and avatar specified that will send the desired message.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc } = poopy.functions
        let globaldata = poopy.globaldata
        let tempdata = poopy.tempdata
        let data = poopy.data
        let config = poopy.config
        let { axios, fileType, DiscordTypes } = poopy.modules
        let bot = poopy.bot

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 3 })
        var name = split[0] ?? ''
        var avatar = split[1] ?? ''
        var message = split[2] ?? ''
        var allBlank = true

        if (tempdata[msg.guild.id][msg.channel.id]['shut']) return ''

        if (globaldata['shit'].find(id => id === msg.author.id)) return 'shit'

        if (data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 &&
                tempdata[msg.author.id]['cooler'] !== msg.id) {
                return `Calm down! Wait more ${(data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        tempdata[msg.author.id]['cooler'] = msg.id
        
        if (!opts.ownermode && tempdata[msg.author.id][msg.id]['execCount'] >= 1 && data.guildData[msg.guild.id]['chaincommands'] == false && !(msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || isBot)) return 'You can\'t chain commands in this server.'
        if (!opts.ownermode && tempdata[msg.author.id][msg.id]['execCount'] >= config.commandLimit * ((msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)) return `Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)}**!`
        tempdata[msg.author.id][msg.id]['execCount']++

        data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = (data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + 2500 / ((msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.author.id === msg.guild.ownerID) ? 5 : 1)

        if (
            msg.channel.type === DiscordTypes.ChannelType.PublicThread ||
            msg.channel.type === DiscordTypes.ChannelType.PrivateThread ||
            msg.channel.type === DiscordTypes.ChannelType.AnnouncementThread
        ) {
            return 'Webhooks can\'t be used here.'
        }

        for (var i = 0; i < name.length; i++) {
            var letter = name[i]
            if (letter !== ' ') {
                allBlank = false
            }
        }

        if (allBlank) {
            return 'Invalid name.'
        }

        var fetchAvatar = await axios({
            url: avatar,
            responseType: 'stream'
        }).catch(() => { })
        if (!fetchAvatar) {
            return 'Invalid avatar.'
        }

        var avatarFiletype = await fileType.fromStream(fetchAvatar.data).catch(() => { })
        if (!avatarFiletype) {
            return 'Invalid avatar.'
        }

        if (!(avatarFiletype.mime.startsWith('image'))) {
            return 'Invalid avatar.'
        }

        if (msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageWebhooks) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageMessages) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.ManageGuild) || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id) || isBot) {
            var webhooks = await msg.channel.fetchWebhooks().catch(() => { })
            if (webhooks ? webhooks.size : undefined) {
                var findWebhook = webhooks.find(webhook => bot.user === webhook.owner)
                if (findWebhook) {
                    await findWebhook.send({
                        content: message,
                        username: name,
                        avatarURL: avatar,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                } else {
                    var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                    if (!createdWebhook) {
                        return 'I need the manage webhooks permission for this command!'
                    } else {
                        await createdWebhook.send({
                            content: message,
                            username: name,
                            avatarURL: avatar,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                }
            } else {
                var createdWebhook = await msg.channel.createWebhook({ name: 'Poopyhook', avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                if (!createdWebhook) {
                    return 'I need the manage webhooks permission for this command!'
                } else {
                    await createdWebhook.send({
                        content: message,
                        username: name,
                        avatarURL: avatar,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                }
            }
        } else {
            return 'You need to have the manage webhooks/messages permission to execute that!'
        }

        return ''
    },
    attemptvalue: 10
}