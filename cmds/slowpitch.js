module.exports = {
    name: ['slowpitch'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[2] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
        var speed = isNaN(Number(args[1])) ? 2 : Number(args[1]) <= 1 ? 1 : Number(args[1]) >= 6 ? 6 : Number(args[1]) || 2
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
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

                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]setpts=${speed}*PTS,fps=fps='min(60,${fps.includes('0/0') ? '60' : fps}/${speed})',scale=ceil(iw/2)*2:ceil(ih/2)*2[v];[0:a]aresample=44100,asetrate=44100/${speed},aresample=44100[a]" -map "[v]" -map "[a]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            } else {
                msg.channel.send({
                    content: `File has no audio stream, maybe you should just use \`slowdown\` for that.`,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                msg.channel.sendTyping().catch(() => { })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:a]aresample=44100,asetrate=44100/${speed},aresample=44100[a]" -map "[a]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp3`)
            await poopy.functions.sendFile(msg, filepath, `output.mp3`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            msg.channel.send({
                content: `Maybe you should just use \`slowdown\` for that.`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'slowpitch [multiplier <number (from 1 to 6)>] <video/audio>',
        value: 'Slows down the file while also decreasing its pitch.'
    },
    cooldown: 2500,
    type: 'Audio'
}