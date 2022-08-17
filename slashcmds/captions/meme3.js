module.exports = {
    name: ['meme3', 'caption'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && poopy.vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var size = 1
        var sizeindex = args.indexOf('-size')
        if (sizeindex > -1) {
            size = isNaN(Number(args[sizeindex + 1])) ? 1 : Number(args[sizeindex + 1]) <= 0.5 ? 0.5 : Number(args[sizeindex + 1]) >= 5 ? 5 : Number(args[sizeindex + 1]) || 1
        }
        var saidMessage = args.slice(1).join(' ').replace(/’/g, '\'')
        poopy.vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/g)
        if (!matchedTextes) {
            matchedTextes = ['""']
        }
        var text = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var white = await poopy.modules.Jimp.read('assets/white.png')
            var futura = await poopy.modules.Jimp.loadFont('assets/fonts/FuturaCondensed/FuturaCondensed.fnt')
            white.resize(width, height)
            white.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var textheight = poopy.modules.Jimp.measureTextHeight(futura, text, white.bitmap.width - Math.round(160 / size))
            white.resize(Math.round(2000 / size), textheight + Math.round(160 / size))
            await white.print(futura, Math.round(80 / size), Math.round(80 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, white.bitmap.width - Math.round(160 / size), white.bitmap.height - Math.round(160 / size))
            white.resize(width, poopy.modules.Jimp.AUTO)
            await white.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/caption.png -i ${filepath}/${filename} -filter_complex "vstack=inputs=2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)

            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var fps = fileinfo.info.fps

            var white = await poopy.modules.Jimp.read('assets/white.png')
            var futura = await poopy.modules.Jimp.loadFont('assets/fonts/FuturaCondensed/FuturaCondensed.fnt')
            white.resize(width, height)
            white.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var textheight = poopy.modules.Jimp.measureTextHeight(futura, text, white.bitmap.width - Math.round(160 / size))
            white.resize(Math.round(2000 / size), textheight + Math.round(160 / size))
            await white.print(futura, Math.round(80 / size), Math.round(80 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, white.bitmap.width - Math.round(160 / size), white.bitmap.height - Math.round(160 / size))
            white.resize(width, poopy.modules.Jimp.AUTO)
            await white.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/caption.png ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/${filename} -map 1:a? -filter_complex "vstack=inputs=2[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)

            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var fps = fileinfo.info.fps

            var white = await poopy.modules.Jimp.read('assets/white.png')
            var futura = await poopy.modules.Jimp.loadFont('assets/fonts/FuturaCondensed/FuturaCondensed.fnt')
            white.resize(width, height)
            white.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var textheight = poopy.modules.Jimp.measureTextHeight(futura, text, white.bitmap.width - Math.round(160 / size))
            white.resize(Math.round(2000 / size), textheight + Math.round(160 / size))
            await white.print(futura, Math.round(80 / size), Math.round(80 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, white.bitmap.width - Math.round(160 / size), white.bitmap.height - Math.round(160 / size))
            white.resize(width, poopy.modules.Jimp.AUTO)
            await white.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/caption.png ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/${filename} -filter_complex "vstack=inputs=2[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)

            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: 'meme3/caption "{text}" {file} [-size <multiplier (from 0.5 to 5)>]',
        value: 'Adds a white box caption to the file.'
    },
    cooldown: 2500,
    type: 'Captions'
}