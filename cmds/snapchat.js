module.exports = {
    name: ['snapchat'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && poopy.vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var size = 1
        var sizeindex = args.indexOf('-size')
        if (sizeindex > -1) {
            size = isNaN(Number(args[sizeindex + 1])) ? 1 : Number(args[sizeindex + 1]) <= 0.5 ? 0.5 : Number(args[sizeindex + 1]) >= 5 ? 5 : Number(args[sizeindex + 1]) || 1
        }
        var saidMessage = args.join(' ').substring(args[0].length + 1).replace(/’/g, '\'')
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
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
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
            var snapchat = await poopy.modules.Jimp.read('templates/snapchat.png')
            var helvetica = await poopy.modules.Jimp.loadFont('templates/fonts/Helvetica/Helvetica.fnt')
            snapchat.resize(width, height)
            snapchat.resize(poopy.modules.Jimp.AUTO, Math.round(2000 / size))
            var textheight = poopy.modules.Jimp.measureTextHeight(helvetica, text, snapchat.bitmap.width - Math.round(100 / size))
            snapchat.resize(snapchat.bitmap.width, textheight + Math.round(100 / size))
            await snapchat.print(helvetica, Math.round(50 / size), Math.round(50 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, snapchat.bitmap.width - Math.round(100 / size), snapchat.bitmap.height - Math.round(100 / size))
            snapchat.resize(width, poopy.modules.Jimp.AUTO)
            await snapchat.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/caption.png -filter_complex "[0:v][1:v]overlay=x=(W-w)/2:y=H/5*4-h/2:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var snapchat = await poopy.modules.Jimp.read('templates/snapchat.png')
            var helvetica = await poopy.modules.Jimp.loadFont('templates/fonts/Helvetica/Helvetica.fnt')
            snapchat.resize(width, height)
            snapchat.resize(poopy.modules.Jimp.AUTO, Math.round(2000 / size))
            var textheight = poopy.modules.Jimp.measureTextHeight(helvetica, text, snapchat.bitmap.width - Math.round(100 / size))
            snapchat.resize(snapchat.bitmap.width, textheight + Math.round(100 / size))
            await snapchat.print(helvetica, Math.round(50 / size), Math.round(50 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, snapchat.bitmap.width - Math.round(100 / size), snapchat.bitmap.height - Math.round(100 / size))
            snapchat.resize(width, poopy.modules.Jimp.AUTO)
            await snapchat.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/caption.png -map 0:a? -filter_complex "[0:v][1:v]overlay=x=(W-w)/2:y=H/5*4-h/2[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var snapchat = await poopy.modules.Jimp.read('templates/snapchat.png')
            var helvetica = await poopy.modules.Jimp.loadFont('templates/fonts/Helvetica/Helvetica.fnt')
            snapchat.resize(width, height)
            snapchat.resize(poopy.modules.Jimp.AUTO, Math.round(2000 / size))
            var textheight = poopy.modules.Jimp.measureTextHeight(helvetica, text, snapchat.bitmap.width - Math.round(100 / size))
            snapchat.resize(snapchat.bitmap.width, textheight + Math.round(100 / size))
            await snapchat.print(helvetica, Math.round(50 / size), Math.round(50 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, snapchat.bitmap.width - Math.round(100 / size), snapchat.bitmap.height - Math.round(100 / size))
            snapchat.resize(width, poopy.modules.Jimp.AUTO)
            await snapchat.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/caption.png -filter_complex "[0:v][1:v]overlay=x=(W-w)/2:y=H/5*4-h/2[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'snapchat "{text}" <file> [-size <multiplier (from 0.5 to 5)>]',
        value: 'Adds a Snapchat caption to the file.'
    },
    cooldown: 2500,
    type: 'Captions'
}