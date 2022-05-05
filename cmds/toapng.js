module.exports = {
    name: ['toapng'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var duration = 10
        var durationindex = args.indexOf('-duration')
        if (durationindex > -1) {
            duration = isNaN(Number(args[durationindex + 1])) ? 10 : Number(args[durationindex + 1]) <= 0.05 ? 0.05 : Number(args[durationindex + 1]) >= 60 ? 60 : Number(args[durationindex + 1]) || 10
        }
        var fps = 50
        var fpsindex = args.indexOf('-fps')
        if (fpsindex > -1) {
            fps = isNaN(Number(args[fpsindex + 1])) ? 20 : Number(args[fpsindex + 1]) <= 0.1 ? 0.1 : Number(args[fpsindex + 1]) >= 50 ? 50 : Number(args[fpsindex + 1]) || 20
        }
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
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

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -plays 0 -t ${duration >= iduration ? iduration : duration} -r ${fps} ${filepath}/output.apng`)
            try {
                poopy.modules.fs.renameSync(`${filepath}/output.apng`, `${filepath}/output.png`)
            } catch (_) {
                await msg.channel.send('Couldn\'t send file.').catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('image') && type.ext === 'gif') {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var iduration = Number(fileinfo.info.duration.includes('N/A') ? '0' : fileinfo.info.duration)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -plays 0 -t ${duration >= iduration ? iduration : duration} -r ${fps} -preset ${poopy.functions.findpreset(args)} ${filepath}/output.apng`)
            try {
                poopy.modules.fs.renameSync(`${filepath}/output.apng`, `${filepath}/output.png`)
            } catch (_) {
                await msg.channel.send('Couldn\'t send file.').catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
                return
            }
            await poopy.functions.sendFile(msg, filepath, `output.png`)
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
        name: 'toapng <video/gif> [-duration <seconds (max 60)>] [-fps <fps (max 50)>]',
        value: 'Converts the video/GIF to APNG. Default duration is 10 and default FPS is 20.'
    },
    cooldown: 2500,
    type: 'Conversion'
}