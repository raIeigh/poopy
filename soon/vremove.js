module.exports = {
    name: ['vremove', 'vreversecrop'],
    execute: async function (msg, args, opts) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
        var y = isNaN(Number(args[1])) ? undefined : Number(args[1]) <= 0 ? 0 : Number(args[1]) ?? undefined
        if (y === undefined) {
            await msg.channel.send('What is the Y axis?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        var h = isNaN(Number(args[2])) ? undefined : Number(args[2]) <= 1 ? 1 : Number(args[2]) || undefined
        if (h === undefined) {
            await msg.channel.send('What is the height?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
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

            var height = fileinfo.info.height

            if (y >= height - 1) y = height - 1
            if (h >= height - y) h = height - y

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]crop=x=0:y=0:w=iw:h=${y}[top];[0:v]crop=x=0:y=${y + h}:w=iw:h=${height - (y + h)}[bottom];[top][bottom]hstack,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)

            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var height = fileinfo.info.height

            if (y >= height - 1) y = height - 1
            if (h >= height - y) h = height - y

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=0:y=0:w=iw:h=${y}[top];[0:v]crop=x=0:y=${y + h}:w=iw:h=${height - (y + h)}[bottom];[top][bottom]hstack[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)

            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`

            var height = fileinfo.info.height

            if (y >= height - 1) y = height - 1
            if (h >= height - y) h = height - y

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=0:y=0:w=iw:h=${y}[top];[0:v]crop=x=0:y=${y + h}:w=iw:h=${height - (y + h)}[bottom];[top][bottom]hstack,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/${object.name}`)

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
        name: '<:newpoopy:839191885310066729> vremove/vreversecrop <y> <h> <file>',
        value: 'Removes a portion of the file vertically depending on the Y axis and height.'
    },
    cooldown: 2500,
    type: 'Resizing'
}