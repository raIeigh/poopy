module.exports = {
    name: ['userinfo', 'whois'],
    args: [{
        "name": "user", "required": true, "specifarg": false, "orig": "<user>",
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
        let { Discord } = poopy.modules
        let config = poopy.config

        args[1] = args[1] ?? ' '

        var member = await msg.guild.members.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => { }) ??
            await bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => { }) ??
            msg.member

        var user = member.user ?? member

        var avatar = member.avatarURL({ dynamic: true, size: 1024, format: 'png' })
        var banner = member.bannerURL({ dynamic: true, size: 1024, format: 'png' })

        var urls = [`[Avatar URL](${avatar})`]
        if (banner) urls.push(`[Banner URL](${banner})`)

        var infoEmbed = {
            author: {
                name: `${member.nickname ?? user.username} (${user.tag})`,
                icon_url: avatar
            },
            description: urls.join(' '),
            color: 0x472604,
            thumbnail: {
                url: avatar
            },
            footer: {
                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                text: bot.user.username
            },
            fields: []
        }

        var status = {
            online: '🟢 Online',
            idle: '🌙 Idle',
            dnd: '⛔ Do Not Disturb',
            offline: '⚫ Offline/Invisible'
        }

        infoEmbed.fields.push({
            name: 'ID',
            value: `\`${user.id}\``,
            inline: true
        })
        infoEmbed.fields.push({
            name: 'Created',
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
            inline: true
        })
        if (member.joinedTimestamp) infoEmbed.fields.push({
            name: 'Joined',
            value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
            inline: true
        })
        infoEmbed.fields.push({
            name: 'Bot',
            value: user.bot ? 'Yes' : 'No',
            inline: true
        })
        /*infoEmbed.fields.push({
            name: 'Badges',
            value: user.flags.toArray().join(', '),
            inline: true
        })*/

        if (member.presence) {
            infoEmbed.fields.push({
                name: 'Status',
                value: status[member.presence.status],
                inline: true
            })

            if (member.presence.activities && member.presence.activities.length) {
                var emoji
                var text

                for (var activity of member.presence.activities) {
                    if (activity.emoji && !emoji) emoji = activity.emoji.toString()
                    if ((activity.state || activity.name) && !text) text = activity.type == Discord.ActivityType.Custom ? activity.state : `**${Discord.ActivityType[activity.type]}** ${activity.type === Discord.ActivityType.Competing && 'in ' || activity.type === Discord.ActivityType.Listening && 'to ' || ''}${activity.name}`
                }

                var activity
                if (emoji && text) activity = `${emoji} ${text}`
                else activity = emoji ?? text

                infoEmbed.fields.push({
                    name: 'Activity',
                    value: activity,
                    inline: true
                })
            }
        }

        if (member.roles) {
            infoEmbed.fields.push({
                name: 'Roles',
                value: member.roles.cache.map(role => role.toString()).join(' '),
                inline: true
            })
        }

        if (!msg.nosend) {
            if (config.textEmbeds) msg.reply({
                content: `${infoEmbed.author.name}\n\n${infoEmbed.description}\n${infoEmbed.fields.map(p => `**${p.name}**: ${p.value}`).join('\n')}`,
                allowedMentions: {
                    parse: ['users']
                }
            }).catch(() => { })
            else msg.reply({
                embeds: [infoEmbed]
            }).catch(() => { })
        }
        return `${infoEmbed.author.name}\n\n${infoEmbed.description}\n${infoEmbed.fields.map(p => `**${p.name}**: ${p.value}`).join('\n')}`
    },
    help: {
        name: '<:newpoopy:839191885310066729> userinfo/whois <user>',
        value: "Shows a user's info."
    },
    cooldown: 2500,
    type: 'Main'
}