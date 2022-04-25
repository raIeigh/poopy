module.exports = {
    name: ['melt', 'trippy'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var decay = 95
        var decayindex = args.indexOf('-decay')
        if (decayindex > -1) {
            decay = isNaN(Number(args[decayindex + 1])) ? 95 : Number(args[decayindex + 1]) <= 0 ? 0 : Number(args[decayindex + 1]) >= 100 ? 100 : Number(args[decayindex + 1]) ?? 95
        }
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
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
            var iduration = Number(fileinfo.info.duration.includes('N/A') ? '0' : fileinfo.info.duration)

            await poopy.functions.execPromise(args.indexOf('-loop') > -1 ? `ffmpeg -stream_loop 1 -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]lagfun=decay=${decay / 100},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p -ss ${iduration} ${filepath}/output.mp4` : `ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]lagfun=decay=${decay / 100},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var iduration = Number(fileinfo.info.duration.includes('N/A') ? '0' : fileinfo.info.duration)

            await poopy.functions.execPromise(args.indexOf('-loop') > -1 ? `ffmpeg -stream_loop 1 -i ${filepath}/${filename} -i templates/black.png -filter_complex "[1:v][0:v]scale2ref[black][gif];[black]split[blackw][blackn];[gif]hue=b=10[white];[blackw][white]overlay=x=0:y=0:format=auto,lagfun=decay=${decay / 100}[meltalpha];[blackn][0:v]overlay=x=0:y=0:format=auto,lagfun=decay=${decay / 100}[melt];[melt][meltalpha]alphamerge,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting -ss ${iduration} ${filepath}/output.gif` : `ffmpeg -i ${filepath}/${filename} -i templates/black.png -filter_complex "[1:v][0:v]scale2ref[black][gif];[black]split[blackw][blackn];[gif]hue=b=10[white];[blackw][white]overlay=x=0:y=0:format=auto,lagfun=decay=${decay / 100}[meltalpha];[blackn][0:v]overlay=x=0:y=0:format=auto,lagfun=decay=${decay / 100}[melt];[melt][meltalpha]alphamerge,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'melt/trippy <file> [-decay <percentage>] [-loop]',
        value: 'Adds a trippy melting effect to the file. Default decay is 95.'
    },
    cooldown: 2500,
    type: 'Effects'
}