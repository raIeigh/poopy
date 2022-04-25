module.exports = {
    name: ['gradualhighpitch', 'gradualincreasepitch'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[2] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
        var speed = isNaN(Number(args[1])) ? 2 : Number(args[1]) <= 1 ? 1 : Number(args[1]) >= 2 ? 2 : Number(args[1]) || 2
        var gradual = []
        var n = 100
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
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
                var duration = Number(fileinfo.info.duration.includes('N/A') ? '0' : fileinfo.info.duration)
                var aduration = Number(fileinfo.info.aduration.includes('N/A') ? '0' : fileinfo.info.aduration)
                var ratio = aduration / duration
                var total = 0
                var f = duration / n
                var ptsvalue = '{next}'

                for (var i = 0; i < n; i++) {
                    var a = i / (n - 1)
                    var a2 = i / n
                    var a3 = (i + 1) / n
                    var start = duration * a2
                    var end = start + f
                    total += f / poopy.functions.lerp(1, speed, a)
                    gradual.push({
                        audio: `[ga${i + 1}]`,
                        filter: `[0:a]atrim=${start}:${end}${i != 0 ? `,aresample=44100,asetrate='44100*${poopy.functions.lerp(1, speed, a)}',aresample=44100,atempo=${1 / poopy.functions.lerp(1, speed, a)}` : ''}[ga${i + 1}]`,
                        pts: i == (n - 1) ? speed : `if(lt(T/${duration},${a3}),${poopy.functions.lerp(1, speed, a)},{next})`
                    })
                }

                for (var i in gradual) {
                    var grad = gradual[i]
                    ptsvalue = ptsvalue.replace('{next}', grad.pts)
                }

                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "${gradual.map(g => g.filter).join(';')};${gradual.map(g => g.audio).join('')}concat=n=${n}:a=1:v=0,atempo[a]" -map 0:v -map "[a]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            } else {
                msg.channel.send({
                    content: `No audio stream detected.`,
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
            var duration = Number(fileinfo.info.duration.includes('N/A') ? '0' : fileinfo.info.duration)

            var f = duration / n

            for (var i = 0; i < n; i++) {
                var a = i / (n - 1)
                var a2 = i / n
                var start = duration * a2
                var end = start + f
                gradual.push({
                    audio: `[ga${i + 1}]`,
                    filter: `[0:a]atrim=${start}:${end}${i != 0 ? `,aresample=44100,asetrate='44100*${poopy.functions.lerp(1, speed, a)}',aresample=44100,atempo=${1 / poopy.functions.lerp(1, speed, a)}` : ''}[ga${i + 1}]`
                })
            }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "${gradual.map(g => g.filter).join(';')};${gradual.map(g => g.audio).join('')}concat=n=${n}:a=1:v=0,atempo[a]" -map "[a]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp3`)
            await poopy.functions.sendFile(msg, filepath, `output.mp3`)
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
        name: 'gradualhighpitch/gradualincreasepitch [multiplier <number (from 1 to 2)>] <video/audio>',
        value: 'Gradually increases the pitch of the file until the end.'
    },
    cooldown: 2500,
    type: 'Audio'
}