module.exports = {
    name: ['battlestats', 'userstats'],
    args: [{
        "name": "user", "required": false, "specifarg": false, "orig": "{user}",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data.guildData[interaction.guild.id]['members']
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
        let vars = poopy.vars
        let config = poopy.config
        let { getLevel } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })

        args[1] = args[1] ?? ''

        var member = await bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => { }) ?? msg.author

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            return
        }

        if (!data.userData[member.id]) {
            data.userData[member.id] = {}
        }

        for (var stat in vars.battleStats) {
            if (data.userData[member.id][stat] === undefined) {
                data.userData[member.id][stat] = vars.battleStats[stat]
            }
        }
        if (!data.userData[member.id].battleSprites) data.userData[member.id].battleSprites = {}

        var levelData = getLevel(data.userData[member.id]['exp'])

        var battleStats = [
            {
                name: "Health",
                value: `${data.userData[member.id]['health']} HP`,
                inline: true
            },
            {
                name: "Max Health",
                value: `${data.userData[member.id]['maxHealth']} HP`,
                inline: true
            },
            {
                name: "Attack",
                value: data.userData[member.id]['attack'],
                inline: true
            },
            {
                name: "Defense",
                value: data.userData[member.id]['defense'],
                inline: true
            },
            {
                name: "Accuracy",
                value: data.userData[member.id]['accuracy'],
                inline: true
            },
            {
                name: "Loot",
                value: data.userData[member.id]['loot'],
                inline: true
            },
            {
                name: "Level",
                value: levelData.level,
                inline: true
            },
            {
                name: "Experience",
                value: `${levelData.exp}/${levelData.required} XP`,
                inline: true
            },
            {
                name: "Total Experience",
                value: `${data.userData[member.id]['exp']} XP`,
                inline: true
            },
            {
                name: "Pobucks",
                value: `${data.userData[member.id]['bucks']} P$`,
                inline: true
            },
        ]

        var sendObject = {
            embeds: [{
                title: `${member.username}\'s Stats`,
                color: 0x472604,
                thumbnail: {
                    url: member.displayAvatarURL({
                        dynamic: true, size: 1024, extension: 'png'
                    })
                },
                footer: {
                    icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                    text: bot.user.username
                },
                fields: battleStats
            }],
            content: `**${member.username}'s Stats**\n\n${battleStats.map(s => `**${s.name}**: ${s.value}`).join('\n')}`,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }
        if (config.textEmbeds) delete sendObject.embeds
        else delete sendObject.content
        if (!msg.nosend) await msg.reply(sendObject).catch(() => { })

        return `**${member.username}'s Stats**\n\n${battleStats.map(s => `**${s.name}**: ${s.value}`).join('\n')}`
    },
    help: {
        name: 'battlestats/userstats {user}',
        value: "Shows the user's battle stats."
    },
    cooldown: 2500,
    type: 'Battling'
}