module.exports = {
    name: ['punch'],
    args: [{
        "name": "subject", "required": true, "specifarg": false, "orig": "<subject>",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data['guild-data'][interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        var action = 'punched'
        var damage = 10
        var chance = 1 / 2

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });

        if (args[1] === undefined && attachments.length <= 0) {
            await msg.reply('What/who is the subject?!').catch(() => { })
            return;
        };

        if (Math.random() <= chance) {
            await msg.reply('You missed!').catch(() => { })
            return
        }

        args[1] = args[1] ?? ''

        var member = (msg.mentions.members.first() && msg.mentions.members.first().user) ??
            await poopy.bot.users.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => { })

        await msg.reply({
            content: `${msg.author.toString()} ${action} **${member.username ?? saidMessage ?? 'this'}**! It did **${damage}** damage!`,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: attachments
        }).catch(() => { })

        if (!member) return

        if (!poopy.data['user-data'][member.id]) {
            poopy.data['user-data'][member.id] = {}
            poopy.data['user-data'][member.id]['health'] = 100
        }

        poopy.data['user-data'][member.id]['health'] = poopy.data['user-data'][member.id]['health'] - damage
        if (poopy.data['user-data'][member.id]['health'] <= 0) {
            poopy.data['user-data'][member.id]['health'] = 100
            await msg.reply({
                content: `**${member.username}** died!`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
    },
    help: { name: 'punch <subject>', value: 'Punch something!' },
    type: 'Battling'
}