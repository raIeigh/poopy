module.exports = {
    name: ['lossygif'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var lossy = 80
        var lossyindex = args.indexOf('-lossy')
        if (lossyindex > -1) {
            lossy = isNaN(Number(args[lossyindex + 1])) ? 80 : Number(args[lossyindex + 1]) <= 30 ? 30 : Number(args[lossyindex + 1]) >= 200 ? 200 : Math.round(Number(args[lossyindex + 1])) || 80
        }
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            await poopy.functions.execPromise(`gifsicle -O3 --lossy=${lossy} -o ${filepath}/output.gif ${filepath}/${filename}`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: 'lossygif <gif> [-lossy <number (from 30 to 200)>]',
        value: 'Lowers the size of a GIF by using lossy LZW compression.'
    },
    cooldown: 2500,
    type: 'Compression'
}