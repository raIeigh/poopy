module.exports = {
    name: ['stats', 'botstats'],
    execute: async function (msg) {
        let poopy = this

        var totalSeconds = (poopy.bot.uptime / 1000);
        var days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.floor(totalSeconds % 60);
        var usage = process.memoryUsage()
        var mused = usage.heapUsed / 1024 / 1024
        var rss = usage.rss / 1024 / 1024
        var cusage = process.cpuUsage()
        var cused = (cusage.user + cusage.system) / 1024 / 1024
        var cpu = poopy.modules.os.cpus()[0].model
        var servers = poopy.bot.guilds.cache.size
        var channels = poopy.bot.channels.cache.size
        var emojis = poopy.bot.emojis.cache.size
        var files = poopy.modules.fs.readdirSync(`temp/${poopy.config.mongodatabase}`).length
        var messages = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['messages']
        var users = Object.keys(poopy.data[poopy.config.mongodatabase]['user-data']).length
        var pcommands = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['commands']
        var reboots = poopy.data[poopy.config.mongodatabase]['bot-data']['bot']['reboots']
        var members = 0

        for (var id in poopy.data[poopy.config.mongodatabase]['guild-data']) {
            var guild = poopy.data[poopy.config.mongodatabase]['guild-data'][id]
            if (guild['members']) members += Object.keys(guild['members']).length
        }

        var statsEmbed = {
            title: 'Poopy\'s Stats',
            color: 0x472604,
            footer: {
                icon_url: poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                text: `${poopy.bot.user.username} - v${poopy.package.version}`
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
                    value: poopy.commands.length.toString(),
                    inline: true
                },
                {
                    name: "Processed Commands",
                    value: pcommands.toString(),
                    inline: true
                },
                {
                    name: "Commands per Minute",
                    value: poopy.vars.cps.toString(),
                    inline: true
                },
                {
                    name: "File Count",
                    value: poopy.vars.filecount.toString(),
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

        msg.channel.send({
            embeds: [statsEmbed],
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })
    },
    help: { name: 'stats/botstats', value: "Shows Poopy's stats." },
    cooldown: 2500,
    type: 'Main'
}