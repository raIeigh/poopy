module.exports = {
    name: ['avatar',
        'av',
        'pfp'],
    args: [{
        "name": "user",
        "required": false,
        "specifarg": false,
        "orig": "[user]",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data.guildData[interaction.guild.id]['allMembers']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return {
                    name: memberData[id].username, value: id
                }
            })
        }
    },
    {
        "name": "global",
        "required": false,
        "specifarg": true,
        "orig": "[-global]"
    }],
    execute: async function (msg, args) {
        let poopy = this
        let bot = poopy.bot
        let config = poopy.config
        let { Discord, DiscordTypes, whatwg } = poopy.modules

        await msg.channel.sendTyping().catch(() => {})

        args[1] = args[1] ?? ' '

        var member = await msg.guild.members.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
            await bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
            msg.member

        if (!member) {
            await msg.reply({
                content: `Invalid user ID: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
            return
        }

        var username = member.username ?? member.user.username
        if (args.includes('-global') || member.user) member = member.user
        var avatar = new Discord.AttachmentBuilder(member.displayAvatarURL({
            dynamic: true, size: 1024, extension: 'png'
        }));
        var parsedAvatar = whatwg.parseURL(avatar.attachment)

        var avObject = {
            allowedMentions: {
                parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: [avatar]
        }

        if (config.textEmbeds) avObject.content = username + '\'s avatar is:'
        else avObject.embeds = [{
            title: username + '\'s Avatar',
            color: 0x472604,
            footer: {
                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                text: bot.user.username
            },
            image: {
                url: `attachment://${parsedAvatar.path[parsedAvatar.path.length - 1]}`
            }
        }]

        if (!msg.nosend) await msg.reply(avObject).catch(() => {})
        return avatar
    },
    help: {
        name: 'avatar/av/pfp [user] [-global]',
        value: "Replies with the user's server/global avatar."
    },
    cooldown: 2500,
    type: 'Main'
}