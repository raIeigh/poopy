module.exports = {
    name: ['reversemagik', 'awareenlarge', 'liquidenlarge'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var scale = 150
        var scaleindex = args.indexOf('-scale')
        if (scaleindex > -1) {
            scale = 100 * (isNaN(Number(args[scaleindex + 1])) ? 1.5 : Number(args[scaleindex + 1]) <= 1 ? 1 : Number(args[scaleindex + 1]) >= 6 ? 6 : Number(args[scaleindex + 1]) || 1.5)
        }
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (fileinfo.info.width > 1000 || fileinfo.info.height > 1000) {
            await msg.channel.send(`That file has width or height higher than 1000 pixels, time to blow.`).catch(() => { })
            poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
            return
        }

        if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var frames = fileinfo.info.frames
            var fps = fileinfo.info.fps.includes('0/0') ? '50' : fileinfo.info.fps

            if (frames > 150) {
                await msg.channel.send(`That video has more than 150 frames, time to blow.`).catch(() => { })
                poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
                return
            }

            poopy.modules.fs.mkdirSync(`${filepath}/frames`)

            await poopy.functions.execPromise(`magick ${filepath}/${filename} -coalesce -liquid-rescale ${scale}% ${filepath}/frames/frame_%d.png`)
            await poopy.functions.execPromise(`ffmpeg -r ${fps} -i ${filepath}/frames/frame_%d.jpg -i ${filepath}/${filename} -map 1:a? -filter_complex "[0:v]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`
            await poopy.functions.execPromise(`magick ${filepath}/${filename} -liquid-rescale ${scale}% ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var frames = fileinfo.info.frames
            var fps = fileinfo.info.fps.includes('0/0') ? '50' : fileinfo.info.fps

            if (frames > 150) {
                await msg.channel.send(`That GIF has more than 150 frames, time to blow.`).catch(() => { })
                poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
                return
            }

            poopy.modules.fs.mkdirSync(`${filepath}/frames`)

            await poopy.functions.execPromise(`magick ${filepath}/${filename} -coalesce -liquid-rescale ${scale}% ${filepath}/frames/frame_%d.png`)
            await poopy.functions.execPromise(`ffmpeg -r ${fps} -i ${filepath}/frames/frame_%d.png -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -vsync 0 -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: '<:newpoopy:839191885310066729> reversemagik/awareenlarge/liquidenlarge <file> [-scale <multiplier (from 1 to 2)>]',
        value: "Enlarges the file by liquid-rescaling it."
    },
    cooldown: 2500,
    type: 'Resizing'
}