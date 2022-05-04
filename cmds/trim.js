module.exports = {
    name: ['trim', 'cut'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[2] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var duration = Number(fileinfo.info.duration)

            var start = 0
            var startindex = args.indexOf('-start')
            if (startindex > -1) {
                var startstamp = args[startindex + 1]
                if (startstamp !== undefined) {
                    var total = 0
                    startstamp = startstamp.split(':').reverse()
                    startstamp.splice(3)
                    for (var i = 0; i < startstamp.length; i++) {
                        startstamp[i] = isNaN(Number(startstamp[i])) ? 0 : Number(startstamp[i]) <= 0 ? 0 : Number(startstamp[i]) * (Math.pow(60, i)) || 0
                        total += startstamp[i]
                    }
                    start = total >= duration ? duration : total
                }
            }
            var end = duration
            var endindex = args.indexOf('-end')
            if (endindex > -1) {
                var endstamp = args[endindex + 1]
                if (endstamp !== undefined) {
                    var total = 0
                    endstamp = endstamp.split(':').reverse()
                    endstamp.splice(3)
                    for (var i = 0; i < endstamp.length; i++) {
                        endstamp[i] = isNaN(Number(endstamp[i])) ? 0 : Number(endstamp[i]) <= 0 ? 0 : Number(endstamp[i]) * (Math.pow(60, i)) || 0
                        total += endstamp[i]
                    }
                    end = total >= duration ? duration : total
                }
            }
            if (end <= start) {
                end = start
            }

            await poopy.functions.execPromise(`ffmpeg -ss ${start} -t ${end - start} -i ${filepath}/${filename} -vf "scale=ceil(iw/2)*2:ceil(ih/2)*2" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            var duration = Number(fileinfo.info.duration)

            var start = 0
            var startindex = args.indexOf('-start')
            if (startindex > -1) {
                var startstamp = args[startindex + 1]
                if (startstamp !== undefined) {
                    var total = 0
                    startstamp = startstamp.split(':').reverse()
                    startstamp.splice(3)
                    for (var i = 0; i < startstamp.length; i++) {
                        startstamp[i] = isNaN(Number(startstamp[i])) ? 0 : Number(startstamp[i]) <= 0 ? 0 : Number(startstamp[i]) * (Math.pow(60, i)) || 0
                        total += startstamp[i]
                    }
                    start = total >= duration ? duration : total
                }
            }
            var end = duration
            var endindex = args.indexOf('-end')
            if (endindex > -1) {
                var endstamp = args[endindex + 1]
                if (endstamp !== undefined) {
                    var total = 0
                    endstamp = endstamp.split(':').reverse()
                    endstamp.splice(3)
                    for (var i = 0; i < endstamp.length; i++) {
                        endstamp[i] = isNaN(Number(endstamp[i])) ? 0 : Number(endstamp[i]) <= 0 ? 0 : Number(endstamp[i]) * (Math.pow(60, i)) || 0
                        total += endstamp[i]
                    }
                    end = total >= duration ? duration : total
                }
            }
            if (end <= start) {
                end = start
            }

            await poopy.functions.execPromise(`ffmpeg -ss ${start} -t ${end - start} -i ${filepath}/${filename} -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp3`)
            await poopy.functions.sendFile(msg, filepath, `output.mp3`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var duration = Number(fileinfo.info.duration)

            var start = 0
            var startindex = args.indexOf('-start')
            if (startindex > -1) {
                var startstamp = args[startindex + 1]
                if (startstamp !== undefined) {
                    var total = 0
                    startstamp = startstamp.split(':').reverse()
                    startstamp.splice(3)
                    for (var i = 0; i < startstamp.length; i++) {
                        startstamp[i] = isNaN(Number(startstamp[i])) ? 0 : Number(startstamp[i]) <= 0 ? 0 : Number(startstamp[i]) * (Math.pow(60, i)) || 0
                        total += startstamp[i]
                    }
                    start = total >= duration ? duration : total
                }
            }
            var end = duration
            var endindex = args.indexOf('-end')
            if (endindex > -1) {
                var endstamp = args[endindex + 1]
                if (endstamp !== undefined) {
                    var total = 0
                    endstamp = endstamp.split(':').reverse()
                    endstamp.splice(3)
                    for (var i = 0; i < endstamp.length; i++) {
                        endstamp[i] = isNaN(Number(endstamp[i])) ? 0 : Number(endstamp[i]) <= 0 ? 0 : Number(endstamp[i]) * (Math.pow(60, i)) || 0
                        total += endstamp[i]
                    }
                    end = total >= duration ? duration : total
                }
            }
            if (end <= start) {
                end = start
            }

            await poopy.functions.execPromise(`ffmpeg -ss ${start} -t ${end - start} -i ${filepath}/${filename} -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: 'trim/cut [-start <timestamp (you can use hh:mm:ss)>] [-end <timestamp (you can use hh:mm:ss)>] <file>',
        value: 'Trims the file from the start timestamp and the end timestamp.'
    },
    cooldown: 2500,
    type: 'Duration'
}