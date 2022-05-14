module.exports = {
    name: ['say', 'talk', 'speak'],
    execute: async function (msg, args) {
        let poopy = this

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
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[1] === undefined && attachments.length <= 0) {
            await msg.channel.send('What is the message to say?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var sendObject = {
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            },
            files: attachments,
            tts: (msg.member.permissions.has('ADMINISTRATOR') || msg.member.permissions.has('SEND_TTS_MESSAGES') || msg.author.id === msg.guild.ownerID) && tts
        }
        if (saidMessage) {
            sendObject.content = saidMessage
        }
        var reply = await msg.fetchReference().catch(() => { })
        if (reply) {
            await reply.reply(sendObject).catch(() => { })
        } else {
            await msg.channel.send(sendObject).catch(() => { })
        }
        if (del) {
            msg.delete().catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'say/talk/speak <message> [-nodelete] [-tts]',
        value: 'Poopy says the message after the command.'
    },
    cooldown: 2500,
    type: 'Main'
}