module.exports = {
    name: ['say', 'talk', 'speak'],
    args: [{ "name": "message", "required": true, "specifarg": false, "orig": "<message>" }, { "name": "nodelete", "required": false, "specifarg": true, "orig": "[-nodelete]" }, { "name": "tts", "required": false, "specifarg": true, "orig": "[-tts]" }],
    execute: async function (msg, args) {
        let poopy = this
        let modules = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        var del = true
        var deleteIndex = args.indexOf('-nodelete')
        if (deleteIndex > -1) {
            args.splice(deleteIndex, 1)
            del = false
        }
        var tts = false
        var ttsIndex = args.indexOf('-tts')
        if (ttsIndex > -1) {
            args.splice(ttsIndex, 1)
            tts = true
        }
        var saidMessage = args.slice(1).join(' ')
        var attachments = msg.attachments.map(attachment => new modules.Discord.MessageAttachment(attachment.url, attachment.name))
        if (args[1] === undefined && attachments.length <= 0) {
            await msg.reply('What is the message to say?!').catch(() => { })
            return;
        };
        var sendObject = {
            allowedMentions: {
                parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: attachments,
            stickers: msg.stickers,
            tts: (msg.member.permissihas('ADMINISTRATOR') || msg.member.permissihas('SEND_TTS_MESSAGES') || msg.author.id === msg.guild.ownerID) && tts
        }
        if (saidMessage) {
            sendObject.content = saidMessage
        }
        var reply = await msg.fetchReference().catch(() => { })
        if (reply) {
            await reply.reply(sendObject).catch(() => { })
        } else {
            if (msg.isCommand && msg.isCommand() && !msg.replied && !del) {
                await msg.reply(sendObject).catch(() => { })
            } else {
                await msg.channel.send(sendObject).catch(() => { })
            }
        }
        if (!msg.isCommand && del) {
            msg.delete().catch(() => { })
        }
    },
    help: {
        name: 'say/talk/speak <message> [-nodelete] [-tts]',
        value: 'Poopy says the message after the command.'
    },
    cooldown: 2500,
    type: 'Main'
}