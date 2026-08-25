module.exports = {
    name: ['ignoredanger', 'toggledanger'],
    args: [],
    execute: async function (msg, _, opts = {}) {
        let poopy = this
        let data = poopy.data
        let config = poopy.config
        let { fetchPingPerms, resolveUser } = poopy.functions
        let { DiscordTypes } = poopy.modules

        if (opts.sourceMsg && msg.author.id != opts.sourceMsg.author.id) {
            await msg.reply("bro").catch(() => { })
            return
        }

        var hasPerms = msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild)
            || msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages)
            || msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator)
            || msg.author.id === msg.guild.ownerId
            || config.ownerids.find(id => id == msg.author.id)

        if (!hasPerms) {
            await msg.reply('You need to be a moderator to execute that!').catch(() => { })
            return
        }
        
        data.guildData[msg.guild.id].ignoreDangerous = !data.guildData[msg.guild.id].ignoreDangerous

        var dangerMsg = `Dangerous command confirmations for the current server have been **${data.guildData[msg.guild.id].ignoreDangerous ? "disabled" : "enabled"}**. This currently includes the following:\n` +
            `- \`battler\`\n` + 
            `- \`larp\`\n`
            `- \`pedro\`\n` + 
            `- \`votekick\``

        if (!msg.nosend) await msg.reply({
            content: dangerMsg,
            allowedMentions: fetchPingPerms(msg)
        }).catch(() => { })
        return dangerMsg
    },
    help: {
        name: 'ignoredanger/toggledanger',
        value: "Toggles the bot's confirmation prompt that shows up when a new user tries executing a dangerous command (currently `battler`, `pedro`, `votekick`) in the current server."
    },
    cooldown: 2500,
    type: 'Settings'
}