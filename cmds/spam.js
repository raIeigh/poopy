module.exports = {
    name: ['spam', 'flood'],
    execute: async function (msg, args) {
        let poopy = this

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
            if (args[1] === undefined && args[2] === undefined) {
                await msg.channel.send('How much do I spam?!').catch(() => { })
                return;
            }
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
            var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)
            var attachments = []
            msg.attachments.forEach(attachment => {
                attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
            });
            var numToRepeat = Number(args[1]);
            if (isNaN(numToRepeat)) {
                await msg.channel.send({
                    content: 'Invalid number: **' + args[1] + '**',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return;
            }
            else if (numToRepeat > 25) {
                await msg.channel.send('Number must be smaller or equal to **25**.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return;
            }
            if (args[2] === undefined && attachments.length <= 0) {
                await msg.channel.send('What is the message to spam?!').catch(() => { })
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
            if (del) {
                msg.delete().catch(() => { })
            }
            for (var i = 0; i < numToRepeat; i++) {
                if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) break
                await poopy.functions.waitMessageCooldown()
                await msg.channel.send(sendObject).catch(() => { })
            };
            await msg.channel.sendTyping().catch(() => { })
        } else {
            await msg.channel.send('You need to have the manage messages permission to execute that!').catch(() => { })
            return;
        };
    },
    help: {
        name: 'spam/flood <times> <message> [-nodelete] [-tts] (manage messages permission only)',
        value: 'Spam a message! Limit is 25.\nExample usage: p:spam 5 stupid'
    },
    cooldown: 10000,
    perms: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
    type: 'Annoying'
}