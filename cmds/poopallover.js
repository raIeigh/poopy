module.exports = {
    name: ['poopallover'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[1] === undefined && attachments.length <= 0) {
            await msg.channel.send('What/who is the subject?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        await msg.channel.send({
            content: '**' + (saidMessage || 'this') + '** has been successfully pooped on.',
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: attachments
        }).catch(() => { })
        await msg.channel.sendTyping().catch(() => { })
    },
    help: { name: 'poopallover <subject>', value: 'Poop on something.' },
    type: 'OG'
}