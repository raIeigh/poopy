module.exports = {
    name: ['speedpitch'],
    args: [{"name":"multiplier","required":false,"specifarg":false,"orig":"[multiplier <number (from 1 to 6)>]"},{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0)
        var speed = isNaN(Number(args[1])) ? 2 : Number(args[1]) <= 1 ? 1 : Number(args[1]) >= 6 ? 6 : Number(args[1]) || 2
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var audio = fileinfo.info.audio

            if (audio) {
                var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                    fileinfo: fileinfo
                })
                var filename = `input.mp4`
                var fps = fileinfo.info.fps

                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]fps=fps='min(60,${fps.includes('0/0') ? '60' : fps}*${speed})',setpts=(1/${speed})*PTS,scale=ceil(iw/2)*2:ceil(ih/2)*2[v];[0:a]aresample=44100,asetrate=44100*${speed},aresample=44100[a]" -map "[v]" -map "[a]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            } else {
                await msg.channel.send({
                    content: `File has no audio stream, maybe you should just use \`speedup\` for that.`,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:a]aresample=44100,asetrate=44100*${speed},aresample=44100[a]" -map "[a]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp3`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp3`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            await msg.channel.send({
                content: `Maybe you should just use \`speedup\` for that.`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
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
        name: 'speedpitch [multiplier <number (from 1 to 6)>] {file}',
        value: 'Speeds up the file while also increasing its pitch.'
    },
    cooldown: 2500,
    type: 'Audio'
}