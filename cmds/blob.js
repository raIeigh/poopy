module.exports = {
    name: ['blob', 'slime', 'squishy2'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var duration = 0.5
        var durationindex = args.indexOf('-duration')
        if (durationindex > -1) {
            duration = isNaN(Number(args[durationindex + 1])) ? 0.5 : Number(args[durationindex + 1]) <= 0.05 ? 0.05 : Number(args[durationindex + 1]) >= 10 ? 10 : Number(args[durationindex + 1]) || 0.5
        }
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -t ${duration} -i ${filepath}/${filename} -r 50 -stream_loop -1 -t ${duration} -i templates/transparent.png -filter_complex "[1:v][0:v]scale2ref=w=iw+iw/10:h=ih[transparent][overlay];[overlay]fps=50,scale=iw+sin(PI/2*(t*4/${duration}))*(iw/10):ih+cos(PI/2*(t*4/${duration}))*(ih/3)-ih/3:eval=frame[ooverlay];[transparent][ooverlay]overlay=x=(W-w)/2:y=(H-h):format=auto,scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -aspect ${Math.floor(width + width / 10)}:${height} -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting -r 50 -t ${duration} ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var fps = fileinfo.info.fps
            await poopy.functions.execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -r ${fps.includes('0/0') ? '50' : fps} -i templates/transparent.png -filter_complex "[1:v][0:v]scale2ref=w=iw+iw/10:h=ih[transparent][overlay];[overlay]scale=iw+sin(PI/2*(t*4/${duration}))*(iw/10):ih+cos(PI/2*(t*4/${duration}))*(ih/3)-ih/3:eval=frame[ooverlay];[transparent][ooverlay]overlay=x=(W-w)/2:y=(H-h):format=auto[out]" -map "[out]" -map 0:a? -c:v libx264 -pix_fmt yuv420p -aspect ${Math.floor(width + width / 10)}:${height} -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
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
        name: 'blob/slime/squishy2 <file> [-duration <seconds (max 10)>]',
        value: 'Makes the file squishy like a blob.'
    },
    cooldown: 2500,
    type: 'Animation'
}