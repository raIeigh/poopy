module.exports = {
    name: ['slam'],
    args: [{"name":"subject","required":true,"specifarg":false,"orig":"<subject>"}],
    execute: async function (msg, args) {
        let poopy = this
        var action = 'slammed'
        var damage = 30
        var chance = 1/4

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
    help: {
        name: 'slam <subject>',
        value: 'Slam something! Has a high chance of missing.'
    },
    type: 'Battling'
}