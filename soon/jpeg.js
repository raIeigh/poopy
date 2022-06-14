module.exports = {
    name: ['jpeg'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var quality = 1
        var qualityindex = args.indexOf('-quality')
        if (qualityindex > -1) {
            quality = isNaN(Number(args[qualityindex + 1])) ? 1 : Number(args[qualityindex + 1]) <= 1 ? 1 : Number(args[qualityindex + 1]) >= 100 ? 100 : Math.round(Number(args[qualityindex + 1])) ?? 1
        }
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
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
            var fps = fileinfo.info.fps.includes('0/0') ? '50' : fileinfo.info.fps
            poopy.modules.fs.mkdirSync(`${filepath}/frames`)
            await poopy.functions.execPromise(`magick ${filepath}/${filename} -quality ${quality} ${filepath}/frames/frame_%d.jpg`)
            await poopy.functions.execPromise(`ffmpeg -r ${fps} -i ${filepath}/frames/frame_%d.jpg -i ${filepath}/${filename} -map 1:a? -b:a 10k -filter_complex "[0:v]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`
            await poopy.functions.execPromise(`magick ${filepath}/${filename} -quality ${quality} ${filepath}/output.jpg`)
            await poopy.functions.sendFile(msg, filepath, `output.jpg`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var fps = fileinfo.info.fps.includes('0/0') ? '50' : fileinfo.info.fps
            poopy.modules.fs.mkdirSync(`${filepath}/frames`)
            poopy.modules.fs.mkdirSync(`${filepath}/mframes`)
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]alphaextract,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/mask.gif`)
            await poopy.functions.execPromise(`magick ${filepath}/${filename} -quality ${quality} ${filepath}/frames/frame_%d.jpg`)
            await poopy.functions.execPromise(`magick ${filepath}/mask.gif -quality ${quality} ${filepath}/mframes/mframe_%d.jpg`)
            await poopy.functions.execPromise(`ffmpeg -r ${fps} -i ${filepath}/frames/frame_%d.jpg -r ${fps} -i ${filepath}/mframes/mframe_%d.jpg -filter_complex "[0:v][1:v]alphamerge,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -vsync 0 -gifflags -offsetting ${filepath}/output.gif`)
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
        name: '<:newpoopy:839191885310066729> jpeg/needsmorejpeg <file> [-quality <percentage>]',
        value: "Adds JPEG artifacts to the file."
    },
    cooldown: 2500,
    type: 'Compression'
}