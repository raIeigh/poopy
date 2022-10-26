module.exports = {
    name: ['userinfo', 'whois'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let bot = poopy.bot
        let { os, fs } = poopy.modules
        let config = poopy.config
        let data = poopy.data
        let pkg = poopy.package
        let commands = poopy.commands
        let vars = poopy.vars

        args[1] = args[1] ?? ' '

        var member = await msg.guild.members.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
            await bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
            msg.member

        var statsEmbed = {
            title: `${bot.user.username}'s Stats`,
            color: 0x472604,
            footer: {
                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                text: `${bot.user.username} - v${pkg.version}`
            },
            fields: [
                {
                    name: "Servers",
                    value: servers.toString(),
                    inline: true
                },
                {
                    name: "Channels",
                    value: channels.toString(),
                    inline: true
                },
                {
                    name: "Messages",
                    value: messages.toString(),
                    inline: true
                },
                {
                    name: "Emojis",
                    value: emojis.toString(),
                    inline: true
                },
                {
                    name: "Users",
                    value: users.toString(),
                    inline: true
                },
                {
                    name: "Members",
                    value: members.toString(),
                    inline: true
                },
                {
                    name: "Uptime",
                    value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                    inline: true
                },
                {
                    name: "Commands",
                    value: commands.length.toString(),
                    inline: true
                },
                {
                    name: "Processed Commands",
                    value: pcommands.toString(),
                    inline: true
                },
                {
                    name: "Commands per Minute",
                    value: vars.cps.toString(),
                    inline: true
                },
                {
                    name: "File Count",
                    value: vars.filecount.toString(),
                    inline: true
                },
                {
                    name: "Processing Files",
                    value: files.toString(),
                    inline: true
                },
                {
                    name: "Reboots",
                    value: reboots.toString(),
                    inline: true
                },
                {
                    name: "CPU",
                    value: cpu.toString(),
                    inline: true
                },
                {
                    name: "Memory Usage",
                    value: `${Math.round(mused * 100) / 100} MB`,
                    inline: true
                },
                {
                    name: "Resident Set Size",
                    value: `${Math.round(rss * 100) / 100} MB`,
                    inline: true
                },
                {
                    name: "CPU Usage",
                    value: `${Math.round(cused * 100) / 100} MB`,
                    inline: true
                },
            ]
        }

        if (!msg.nosend) {
            if (config.textEmbeds) msg.reply({
                content: `${statsEmbed.fields.map(p => `**${p.name}**: ${p.value}`).join('\n')}\n\nv${pkg.version}`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            else msg.reply({
                embeds: [statsEmbed]
            }).catch(() => { })
        }
        return `${statsEmbed.fields.map(p => `**${p.name}**: ${p.value}`).join('\n')}\n\nv${pkg.version}`
    },
    help: {
        name: '<:newpoopy:839191885310066729> userinfo/whois',
        value: "Shows a user's info."
    },
    cooldown: 2500,
    type: 'Main'
}