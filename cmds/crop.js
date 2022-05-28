module.exports = {
    name: ['crop'],
    execute: async function (msg, args, opts) {
        let poopy = this

        var pathObject = opts.pathObject

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
        var fileinfo

        if (pathObject) {
            fileinfo = await poopy.functions.validateFileFromPath(`${pathObject.path}/${pathObject.name}`, true).catch(async error => {
                await msg.channel.send(error).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return;
            })
        } else {
            fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
                await msg.channel.send(error).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return;
            })
        }

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath
            var filename
            var object

            if (pathObject) {
                filepath = pathObject.path
                filename = pathObject.name
                object = pathObject
                object.chaincount++
                object.name = `output${object.chaincount}.mp4`
            } else {
                filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                    fileinfo: fileinfo
                })
                filename = `input.mp4`
                object = {
                    path: filepath,
                    name: `output.mp4`,
                    chaincount: 0
                }
            }

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
                h = isNaN(Number(args[hindex + 1])) ? height - y : Number(args[hindex + 1]) <= 1 ? 1 : Number(args[hindex + 1]) >= height - y - 1 ? height - y : Math.round(Number(args[hindex + 1])) || height - y
            }

            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]crop=x=${x}:y=${y}:w=${w}:h=${h},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/${object.name}`)

            if (args.join(' ').includes('-chain')) {
                return object
            } else {
                await poopy.functions.sendFile(msg, filepath, object.name)
            }
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath
            var filename
            var object

            if (pathObject) {
                filepath = pathObject.path
                filename = pathObject.name
                object = pathObject
                object.chaincount++
                object.name = `output${object.chaincount}.png`
            } else {
                filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                    fileinfo: fileinfo
                })
                filename = `input.png`
                object = {
                    path: filepath,
                    name: `output.png`,
                    chaincount: 0
                }
            }

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
                h = isNaN(Number(args[hindex + 1])) ? height - y : Number(args[hindex + 1]) <= 1 ? 1 : Number(args[hindex + 1]) >= height - y - 1 ? height - y : Math.round(Number(args[hindex + 1])) || height - y
            }

            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=${x}:y=${y}:w=${w}:h=${h}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/${object.name}`)

            if (args.join(' ').includes('-chain')) {
                return object
            } else {
                await poopy.functions.sendFile(msg, filepath, object.name)
            }
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath
            var filename
            var object

            if (pathObject) {
                filepath = pathObject.path
                filename = pathObject.name
                object = pathObject
                object.chaincount++
                object.name = `output${object.chaincount}.gif`
            } else {
                filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                    fileinfo: fileinfo
                })
                filename = `input.gif`
                object = {
                    path: filepath,
                    name: `output.gif`,
                    chaincount: 0
                }
            }

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
                h = isNaN(Number(args[hindex + 1])) ? height - y : Number(args[hindex + 1]) <= 1 ? 1 : Number(args[hindex + 1]) >= height - y - 1 ? height - y : Math.round(Number(args[hindex + 1])) || height - y
            }

            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=${x}:y=${y}:w=${w}:h=${h},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/${object.name}`)

            if (args.join(' ').includes('-chain')) {
                return object
            } else {
                await poopy.functions.sendFile(msg, filepath, `output.gif`)
            }
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