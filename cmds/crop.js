module.exports = {
    name: ['crop'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
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

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var x = 0
            var xindex = args.indexOf('-x')
            if (xindex > -1) {
                x = isNaN(Number(args[xindex + 1])) ? 0 : Number(args[xindex + 1]) <= 0 ? 0 : Number(args[xindex + 1]) >= width - 1 ? width - 1 : Math.round(Number(args[xindex + 1])) || 0
            }

            var y = 0
            var yindex = args.indexOf('-y')
            if (yindex > -1) {
                y = isNaN(Number(args[yindex + 1])) ? 0 : Number(args[yindex + 1]) <= 0 ? 0 : Number(args[yindex + 1]) >= height - 1 ? height - 1 : Math.round(Number(args[yindex + 1])) || 0
            }

            var w = width - x
            var windex = args.indexOf('-w')
            if (windex > -1) {
                w = isNaN(Number(args[windex + 1])) ? width - x : Number(args[windex + 1]) <= 1 ? 1 : Number(args[windex + 1]) >= width - x ? width - x : Math.round(Number(args[windex + 1])) || width - x
            }

            var h = height - y
            var hindex = args.indexOf('-h')
            if (hindex > -1) {
                h = isNaN(Number(args[hindex + 1])) ? height - y : Number(args[hindex + 1]) <= 1 ? 1 : Number(args[hindex + 1]) >= height - y ? height - y : Math.round(Number(args[hindex + 1])) || height - y
            }

            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]crop=x=${x}:y=${y}:w=${w}:h=${h},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)

            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var x = 0
            var xindex = args.indexOf('-x')
            if (xindex > -1) {
                x = isNaN(Number(args[xindex + 1])) ? 0 : Number(args[xindex + 1]) <= 0 ? 0 : Number(args[xindex + 1]) >= width - 1 ? width - 1 : Math.round(Number(args[xindex + 1])) || 0
            }

            var y = 0
            var yindex = args.indexOf('-y')
            if (yindex > -1) {
                y = isNaN(Number(args[yindex + 1])) ? 0 : Number(args[yindex + 1]) <= 0 ? 0 : Number(args[yindex + 1]) >= height - 1 ? height - 1 : Math.round(Number(args[yindex + 1])) || 0
            }

            var w = width - x
            var windex = args.indexOf('-w')
            if (windex > -1) {
                w = isNaN(Number(args[windex + 1])) ? width - x : Number(args[windex + 1]) <= 1 ? 1 : Number(args[windex + 1]) >= width - x ? width - x : Math.round(Number(args[windex + 1])) || width - x
            }

            var h = height - y
            var hindex = args.indexOf('-h')
            if (hindex > -1) {
                h = isNaN(Number(args[hindex + 1])) ? height - y : Number(args[hindex + 1]) <= 1 ? 1 : Number(args[hindex + 1]) >= height - y ? height - y : Math.round(Number(args[hindex + 1])) || height - y
            }

            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=${x}:y=${y}:w=${w}:h=${h}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)

            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var x = 0
            var xindex = args.indexOf('-x')
            if (xindex > -1) {
                x = isNaN(Number(args[xindex + 1])) ? 0 : Number(args[xindex + 1]) <= 0 ? 0 : Number(args[xindex + 1]) >= width - 1 ? width - 1 : Math.round(Number(args[xindex + 1])) || 0
            }

            var y = 0
            var yindex = args.indexOf('-y')
            if (yindex > -1) {
                y = isNaN(Number(args[yindex + 1])) ? 0 : Number(args[yindex + 1]) <= 0 ? 0 : Number(args[yindex + 1]) >= height - 1 ? height - 1 : Math.round(Number(args[yindex + 1])) || 0
            }

            var w = width - x
            var windex = args.indexOf('-w')
            if (windex > -1) {
                w = isNaN(Number(args[windex + 1])) ? width - x : Number(args[windex + 1]) <= 1 ? 1 : Number(args[windex + 1]) >= width - x ? width - x : Math.round(Number(args[windex + 1])) || width - x
            }

            var h = height - y
            var hindex = args.indexOf('-h')
            if (hindex > -1) {
                h = isNaN(Number(args[hindex + 1])) ? height - y : Number(args[hindex + 1]) <= 1 ? 1 : Number(args[hindex + 1]) >= height - y ? height - y : Math.round(Number(args[hindex + 1])) || height - y
            }

            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=${x}:y=${y}:w=${w}:h=${h},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)

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
        name: 'crop [-x <pixel>] [-y <pixel>] [-w <pixels>] [-h <pixels>] <file>',
        value: 'Crops the file depending on the XY axes and the width and height.'
    },
    cooldown: 2500,
    type: 'Resizing'
}