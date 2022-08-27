module.exports = {
    name: ['tango', 'deleteembed', 'dembed'],
    args: [{"name":"message","required":false,"specifarg":false,"orig":"{message}"}],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        
        if (config.textEmbeds) {
            await msg.reply('but how').catch(() => { })
            return
        }

        var saidMessage = args.slice(1).join(' ')
        var rulesChannel = msg.guild.channels.cache.find(channel => channel.name === 'rules' || channel.name.includes('rule'))
        var tangoEmbed = {
            "author": {
                "name": msg.author.tag,
                "icon_url": msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
            },
            "description": `**Message sent by <@${msg.author.id}> deleted in <#${rulesChannel && rulesChannel.id || msg.channel.id}>**\n${saidMessage}`,
            "color": 0xFF470F,
            "timestamp": Date.now(),
            "footer": {
                "text": `Author: ${msg.author.id} | Message ID: ${msg.id}`
            },
        };
        await msg.reply({
            allowedMentions: {
                parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            embeds: [tangoEmbed]
        }).catch(() => { })
    },
    help: { name: 'tango/deleteembed/dembed {message}', value: 'tango' },
    cooldown: 2500,
    type: 'Inside Joke'
}