module.exports = {
    name: ['ascii', 'braille'],
    args: [{"name":"negative","required":false,"specifarg":true},{"name":"image","required":true,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0, true) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the image to asciify?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0, true) || args[1]
        var saidMessage = args.slice(1).join(' ')
        var negative = false
        if (saidMessage.includes('-negative')) negative = true
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var brailleText = await poopy.functions.braille(currenturl, negative)
            await msg.channel.send({
                content: brailleText,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/ascii.txt`, brailleText)
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/ascii.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            })
            await msg.channel.sendTyping().catch(() => { })
        } else {
            await msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'ascii/braille [-negative] <image>',
        value: 'Converts the image to ASCII.\n' +
            'Example usage: p:ascii -negative https://cdn.discordapp.com/emojis/827634704722165783.png'
    },
    cooldown: 2500,
    type: 'Text'
}