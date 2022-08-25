module.exports = {
    name: ['avatar',
        'av',
        'pfp'],
    args: [{
        "name": "user",
        "required": false,
        "specifarg": false,
        "orig": "[user]",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data['guild-data'][interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return {
                    name: memberData[id].username, value: id
                }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => {})

        args[1] = args[1] ?? ''

        var member = (msg.mentions.members.first() && msg.mentions.members.first().user) ??
        await poopy.bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
        msg.author

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
            return
        }

        var avatar = new poopy.modules.Discord.MessageAttachment(member.displayAvatarURL({
            dynamic: true, size: 1024, format: 'png'
        }));
        await msg.reply({
            content: member.username + '\'s avatar is:',
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: [avatar]
        }).catch(() => {})
    },
    help: {
        name: 'avatar/av/pfp [user]',
        value: "Replies with the user's avatar."
    },
    cooldown: 2500,
    type: 'Main'
}