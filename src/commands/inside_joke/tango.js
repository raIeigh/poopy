module.exports = {
    name: ['tango', 'deleteembed', 'dembed'],
    args: [{name: "message",required: false,specifarg: false,orig: "{message}"}],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let { fetchPingPerms } = poopy.functions
        
        if (config.textEmbeds) {
            await msg.reply('but how').catch(() => { })
            return
        }

        var saidMessage = args.slice(1).join(' ').trim() || "tango"
        
        var validChannels = msg.guild.channels.cache.filter(c => ![4, 11, 12].includes(c.type))
        var rulesChannel = validChannels.find(c => c.name === "rules")
            ?? validChannels.find(c => c.name?.includes?.("rule"))
            ?? validChannels.first()

        var tangoEmbed = {
            author: {
                name: msg.author.tag,
                icon_url: msg.author.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' })
            },
            description: `**Message sent by <@${msg.author.id}> deleted in <#${rulesChannel?.id ?? msg.channel?.id}>**\n${saidMessage}`,
            color: 0xFF470F,
            timestamp: new Date().toISOString(),
            footer: {
                text: `Author: ${msg.author.id} | Message ID: ${msg.id}`
            },
        }

        if (!msg.nosend) await msg.reply({
            allowedMentions: fetchPingPerms(msg),
            embeds: [tangoEmbed]
        }).catch(() => { })
        return 'but how'
    },
    help: { name: 'tango/deleteembed/dembed {message}', value: 'tango' },
    cooldown: 2500,
    type: 'Inside Joke'
}
