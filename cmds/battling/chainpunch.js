module.exports = {
    name: ['chainpunch'],
    args: [{ "name": "subject", "required": true, "specifarg": false, "orig": "<subject>" }],
    execute: async function (msg, args) {
        let poopy = this
        var action = 'chain punched'
        var damage = Math.round(Math.random() * 18) + 6 // from 18 to 24
        var chance = 1/3

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

        var member = (msg.mentions.members.first() && msg.mentions.members.first().user) ??
            await poopy.bot.users.fetch(args[1]).catch(() => { })

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
            await msg.channel.send({
                content: `**${member.username}** died!`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
    },
    help: {
        name: 'chainpunch <subject>',
        value: 'Chain punch something! Does random damage, and has a pretty high chance to miss.'
    },
    type: 'Battling'
}