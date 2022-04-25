module.exports = {
    name: ['tango', 'deleteembed', 'dembed'],
    execute: async function (msg, args) {
        let poopy = this

        var saidMessage = args.join(' ').substring(args[0].length + 1)
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
        msg.channel.send({
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            embeds: [tangoEmbed]
        }).catch(() => { })
    },
    help: { name: 'tango/deleteembed/dembed {message}', value: 'tango' },
    cooldown: 2500,
    type: 'Inside Joke'
}