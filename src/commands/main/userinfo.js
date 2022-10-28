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

        var avatar = member.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }) ?? user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' })
        var banner = user.bannerURL({ dynamic: true, size: 1024, extension: 'png' })

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
                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
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

        var badgeEmojis = {
            GuildOwner: `<:Guild_owner:1035668034934820966>`,
            Bot: `<:Bot:1035679153917263995>`,
            Staff: `<:Discord_Staff:1035668039338840144>`,
            Partner: `<:Partner:1035670800386248825>`,
            Hypesquad: `<:HypeSquad_Event:1035668031889748018>`,
            BugHunterLevel1: `<:Bug_Hunter:1035668016572157952>`,
            BugHunterLevel2: `<:Bug_Hunter_level2:1035668040966230170>`,
            Nitro: `<:nitro:1035668012797276180>`,
            Boost1Month: `<:boost1month:1035668044661391371>`,
            Boost2Month: `<:boost2month:1035668018195345419>`,
            Boost3Month: `<:boost3month:1035668021143937094>`,
            Boost6Month: `<:boost6month:1035668019747246080>`,
            Boost9Month: `<:boost9month:1035668042555871252>`,
            Boost12Month: `<:boost12month:1035668030279122964>`,
            Boost15Month: `<:boost15month:1035668014458228847>`,
            Boost18Month: `<:boost18month:1035668024113516605>`,
            Boost24Month: `<:boost24month:1035668022595174581>`,
            HypeSquadOnlineHouse1: `<:HypeSquad_Bravery:1035668028932771840>`,
            HypeSquadOnlineHouse2: `<:HypeSquad_Brilliance:1035668026957246555>`,
            HypeSquadOnlineHouse3: `<:HypeSquad_Balance:1035668037971497040>`,
            PremiumEarlySupporter: `<:early_supporter:1035668025292099615>`,
            TeamPseudoUser: `<:Team_Pseudo_User:1035673000244170832>`,
            CertifiedModerator: `<:Discord_certified_moderator:1035668036608331836>`,
            VerifiedBot: `<:Verified_Bot:1035673002202898545>`,
            VerifiedDeveloper: `<:Verified_Bot_Developer:1035668033663930429>`,
            BotHTTPInteractions: `<:BotHTTPInteractions:1035675213523845252>`,
            Spammer: `<:Spammer:1035673850085638285>`,
            Quarantined: `<:Quarantined:1035673851503325224>`
        }

        var flags = user.flags.toArray()

        if (member.premiumSince) {
            flags.push(`Nitro`)

            var now = new Date()
            var months = (now.getFullYear() - member.premiumSince.getFullYear()) * 12 - now.getMonth() + member.premiumSince.getMonth()
            var tiers = [24, 18, 15, 12, 9, 6, 3, 2, 1]

            for (var tier of tiers) {
                if (months >= tier) {
                    flags.push(`Boost${tier}Month`)
                    break
                }
            }
        }
        if (user.id == msg.guild.ownerId) flags.push('GuildOwner')
        if (user.bot) flags.push('Bot')

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
        if (flags.length) infoEmbed.fields.push({
            name: 'Badges',
            value: flags.map(b => !config.self && badgeEmojis[b] || b).join(' '),
            inline: true
        })

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
                    if ((activity.state || activity.name) && !text) text = activity.type == Discord.ActivityType.Custom ? activity.state : `${Discord.ActivityType[activity.type]} ${activity.type === Discord.ActivityType.Competing && 'in ' || activity.type === Discord.ActivityType.Listening && 'to ' || ''}**${activity.name}**`
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
                value: member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).map(role => role.toString()).join(' '),
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