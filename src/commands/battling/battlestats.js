module.exports = {
    name: ['battlestats', 'userstats'],
    args: [{
        "name": "user", "required": false, "specifarg": false, "orig": "{user}",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data['guild-data'][interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        let bot = poopy.bot
        let data = poopy.data
        let config = poopy.config

        await msg.channel.sendTyping().catch(() => { })

        args[1] = args[1] ?? ''

        var member = (msg.mentions.members.first() && msg.mentions.members.first().user) ??
            await bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => { }) ??
            msg.author

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            return
        }

        if (!data['user-data'][member.id]) {
            data['user-data'][member.id] = {}
        }
        if (!data['user-data'][member.id]['health']) {
            data['user-data'][member.id]['health'] = 100
        }
        var sendObject = {
            embeds: [{
                title: `${member.username}\'s Stats`,
                color: 0x472604,
                footer: {
                    icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                    text: bot.user.username
                },
                fields: [
                    {
                        name: "Health",
                        value: `${data['user-data'][member.id]['health']} HP`
                    }
                ]
            }],
            content: `**${member.username}'s Stats**\n\nHealth: \`${data['user-data'][member.id]['health']} HP\``,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }
        if (config.textEmbeds) delete sendObject.embeds
        else delete sendObject.content
        await msg.reply(sendObject).catch(() => { })
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'battlestats/userstats {user}',
        value: "Shows the user's battle stats."
    },
    cooldown: 2500,
    type: 'Battling'
}