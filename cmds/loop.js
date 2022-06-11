module.exports = {
    name: ['loop', 'repeat'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var numToRepeat = typeof (Number(args[2])) === 'number' && ((Number(args[2]) >= 10 && 10) || (Number(args[2]) < 2 && 2)) || typeof (Number(args[1])) === 'number' && ((Number(args[1]) >= 10 && 10) || (Number(args[1]) < 2 && 2)) || 2
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var list = ''
            for (var i = 0; i < numToRepeat; i++) {
                list = `${list}file '${filename}'\n`
            }
            poopy.modules.fs.writeFileSync(`${filepath}/list.txt`, list)
            await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/list.txt -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var list = ''
            for (var i = 0; i < numToRepeat; i++) {
                list = `${list}file '${filename}'\n`
            }
            poopy.modules.fs.writeFileSync(`${filepath}/list.txt`, list)
            await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/list.txt -preset ${poopy.functions.findpreset(args)} -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            var list = ''
            for (var i = 0; i < numToRepeat; i++) {
                list = `${list}file '${filename}'\n`
            }
            poopy.modules.fs.writeFileSync(`${filepath}/list.txt`, list)
            await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/list.txt -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp3`)
            await poopy.functions.sendFile(msg, filepath, `output.mp3`)
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
        name: 'loop/repeat <video/audio/gif> [times]',
        value: "Loops the file, if [times] is supplied, it'll loop [times] times.\n" +
            'Example usage: p:loop https://cdn.discordapp.com/attachments/621060031357517827/823936228323623023/video.mp4 3'
    },
    cooldown: 2500,
    type: 'Duration'
}