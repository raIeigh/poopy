module.exports = {
    name: ['generatetext', 'predicttext'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (args[1] === undefined) {
            msg.channel.send('What is the text to generate?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (poopy.vars.validUrl.test(saidMessage)) {
            msg.channel.send('URLs in this command will break it.').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
        var resp = await poopy.modules.deepai.callStandardApi("text-generator", {
            text: saidMessage,
        }).catch(err => {
            msg.channel.send({
                content: err.stack,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        })
        if (resp) {
            msg.channel.send({
                content: resp.output,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
        msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'generatetext/predicttext <message>',
        value: 'Tries to predict subsequent text from the specified message.'
    },
    type: 'Text'
}