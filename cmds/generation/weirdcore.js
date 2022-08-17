module.exports = {
    name: ['weirdcore', 'text2img', 'text2image', 't2i'],
    args: [{"name":"message","required":true,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.channel.send('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (poopy.vars.validUrl.test(saidMessage)) {
            await msg.channel.send('URLs in this command will break it.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
        var resp = await poopy.modules.deepai.callStandardApi("text2img", {
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
                files: [new poopy.modules.Discord.MessageAttachment(resp.output_url)]
            }).catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'weirdcore/text2img/text2image/t2i <message>',
        value: 'Generates a picture depending on what the text is with DeepAI.'
    },
    cooldown: 2500,
    type: 'Generation',
    envRequired: ['DEEPAIKEY']
}