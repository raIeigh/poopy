module.exports = {
    name: ['weirdcore', 'text2img', 'text2image', 't2i'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        if (args[1] === undefined) {
            msg.channel.send('What is the text?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (poopy.vars.validUrl.test(saidMessage)) {
            msg.channel.send('URLs in this command will break it.').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
        var resp = await poopy.modules.deepai.callStandardApi("text2img", {
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
                files: [new poopy.modules.Discord.MessageAttachment(resp.output_url)]
            }).catch(() => { })
        }
        msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'weirdcore/text2img/text2image/t2i <message>',
        value: 'Generates a picture depending on what the text is. Can look eerie sometimes.'
    },
    cooldown: 2500,
    type: 'Generation'
}