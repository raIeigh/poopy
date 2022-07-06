module.exports = {
    name: ['generatetext', 'predicttext'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.channel.send('What is the text to generate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
        if (poopy.vars.validUrl.test(saidMessage)) {
            await msg.channel.send('URLs in this command will break it.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
        var resp = await poopy.modules.deepai.callStandardApi("text-generator", {
            text: saidMessage,
        }).catch(async err => {
            await msg.channel.send({
                content: err.stack,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        })
        if (resp) {
            await msg.channel.send({
                content: resp.output,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'generatetext/predicttext <message>',
        value: 'Tries to predict subsequent text from the specified message with DeepAI.'
    },
    type: 'Text',
    envRequired: ['DEEPAIKEY']
}