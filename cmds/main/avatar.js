module.exports = {
    name: ['avatar', 'av', 'pfp'],
    args: [{"name":"user","required":false,"specifarg":false,"orig":"[user]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        var member = (msg.mentions.members.first() && msg.mentions.members.first().user) ??
            await poopy.bot.users.fetch(args[1]).catch(() => { }) ??
            msg.author

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            return
        }

        var avatar = new poopy.modules.Discord.MessageAttachment(member.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }));
        await msg.reply({
            content: member.username + '\'s avatar is:',
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: [avatar]
        }).catch(() => { })
    },
    help: {
        name: 'avatar/av/pfp [user]',
        value: "Replies with the user's avatar."
    },
    cooldown: 2500,
    type: 'Main'
}