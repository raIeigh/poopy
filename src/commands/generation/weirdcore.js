module.exports = {
    name: ['weirdcore', 'text2img', 'text2image', 't2i'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"}],
    execute: async function (msg, args) {
        let poopy = this
        let vars = poopy.vars
        let { deepai, Discord } = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (vars.validUrl.test(saidMessage)) {
            await msg.reply('URLs in this command will break it.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
        var resp = await deepai.callStandardApi("text2img", {
            text: saidMessage,
        }).catch(async err => {
            await msg.reply({
                content: err.stack,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        })
        if (resp) {
            await msg.reply({
                files: [new Discord.AttachmentBuilder(resp.output_url)]
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
    envRequired: ['DEEPAI_KEY']
}