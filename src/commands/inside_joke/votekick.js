module.exports = {
    name: ['votekick'],
    args: [
        {
            name: "user",
            required: true,
            specifarg: false,
            orig: "{user}",
            autocomplete: async function (interaction) {
                let poopy = this
                let { data, config } = poopy
                let { dataGather } = poopy.functions

                if (!data.guildData[interaction.guild.id]) {
                    data.guildData[interaction.guild.id] = !config.testing && process.env.MONGODB_URL && await dataGather.guildData(config.database, interaction.guild.id).catch((e) => console.log(e)) || {}
                }

                var memberData = data.guildData[interaction.guild.id].allMembers ?? {}
                var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

                return memberKeys.map(id => {
                    return { name: memberData[id].username, value: id }
                })
            }
        },
        { name: "goal", required: false, specifarg: true, orig: "[-goal <votes (default: active members * (1/2))>]" },
        { name: "action", required: false, specifarg: true, orig: "[-action <timeout|mute|kick|ban>]", autocomplete: ["timeout", "mute", "kick", "ban"] },
        { name: "duration", required: false, specifarg: true, orig: "[-duration <seconds (default 45)>]" },
    ],
    execute: async function (msg, args, opts = {}) {
        let poopy = this
        let config = poopy.config
        let data = poopy.data
        let { fetchPingPerms, resolveUser, getOption, parseNumber, parseString, votekick, yesno } = poopy.functions
        let { DiscordTypes } = poopy.modules

        const goal = getOption(
            args, 'goal',
            {
                dft: undefined,
                splice: true,
                n: 1,
                join: true,
                func: (opt) => parseNumber(
                    opt, { dft: undefined, min: 0 }
                )
            }
        )

        const action = getOption(
            args, 'action',
            {
                dft: "timeout",
                splice: true,
                n: 1,
                join: true,
                func: (opt) => parseString(
                    opt, ["timeout", "mute", "kick", "ban"],
                    { dft: "timeout", lower: true }
                )
            }
        )

        const duration = getOption(
            args, 'duration',
            {
                dft: 45,
                splice: true,
                n: 1,
                join: true,
                func: (opt) => parseNumber(
                    opt, { dft: 45, min: 0, max: 300 }
                )
            }
        )

        const permissions = msg.member.permissions
        const isPoopyOwner = config.ownerids.find(id => id == msg.author.id)
        const canUseAction = (action == "ban" && permissions.has(DiscordTypes.PermissionFlagsBits.BanMembers))
            || (action == "kick" && permissions.has(DiscordTypes.PermissionFlagsBits.KickMembers))
            || ((action == "timeout" || action == "mute") && (permissions.has(DiscordTypes.PermissionFlagsBits.ModerateMembers) || opts.isBot))

        if (!isPoopyOwner && !canUseAction) {
            await msg.reply(`You don't have permissions to use the ${action} action.`).catch(() => { })
            return
        }

        var member
        var userQuery = args.slice(1).join(' ').trim()

        if (userQuery) {
            member = userQuery ? await resolveUser(userQuery, msg.guild, "member").catch(() => { }) : msg.author
    
            if (!member) {
                await msg.reply({
                    content: `Invalid member: **${userQuery}**`,
                    allowedMentions: fetchPingPerms(msg)
                }).catch(() => { })
                return
            }
        }

        if (!data.userData[msg.author.id].dangerousExecuted.includes("votekick") && !msg.nosend && !opts.isBot && !data.guildData[msg.guild.id].ignoreDangerous) {
            var confirm = await yesno(msg.channel, "# Are you sure?\n"
                + "okay, so there is a chance you might be executing this command because someone told you to do it "
                + "and you have no idea what it does, basically by default it'll initiate a votekick on a random member (if not specified)"
                + "with a set goal depending on how many people have recently chatted in the current channel, and when it's "
                + "reached, the member will be timed out for 10 minutes (other actions can also be chosen such as mute, kick or ban)...\n"
                + "-# (a server admin can disable these confirmation prompts for the current server entirely with `p:ignoredanger`)", msg.member, undefined, msg).catch(() => { })
            if (!confirm) return

            data.userData[msg.author.id].dangerousExecuted.push("votekick")
        }

        return await votekick(member, msg.channel, goal, action, duration * 1000)
    },
    help: {
        name: 'votekick {user} [-goal <votes (default: active members * (1/2))>] [-action <timeout|mute|kick|ban>] [-duration <seconds (default 45)>] (moderator only)',
        value: 'Starts a votekick on the specified user. When the goal is reached, it executes an action on them, by default a 10 minute timeout.'
    },
    cooldown: 2500,
    perms: [
        'Administrator',
        'ModerateMembers',
        'KickMembers',
        'BanMembers'
    ],
    type: 'Inside Joke'
}
