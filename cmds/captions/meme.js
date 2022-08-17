module.exports = {
    name: ['meme'],
    args: [{"name":"topText","required":false,"specifarg":false,"orig":"\"{topText}\""},{"name":"bottomText","required":false,"specifarg":false,"orig":"\"[bottomText]\""},{"name":"file","required":false,"specifarg":false,"orig":"{file}"},{"name":"size","required":false,"specifarg":true,"orig":"[-size <multiplier (from 0.5 to 5)>]"}],
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
            matchedTextes = ['""', '""']
        } else if (!matchedTextes[1]) {
            matchedTextes[1] = '""'
        }
        var text = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
        var text2 = matchedTextes[1].substring(1, matchedTextes[1].length - 1)
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
            var transparent = await poopy.modules.Jimp.read('assets/transparent.png')
            var impact = await poopy.modules.Jimp.loadFont('assets/fonts/Impact/Impact.fnt')
            transparent.resize(width, height)
            transparent.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var transparent2 = transparent.clone()
            await transparent.print(impact, 20, 20, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, transparent.bitmap.width - 40, transparent.bitmap.height - 40)
            await transparent2.print(impact, 20, 20, { text: poopy.modules.Discord.Util.cleanContent(text2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_BOTTOM }, transparent.bitmap.width - 40, transparent.bitmap.height - 40)
            transparent.resize(width, height)
            transparent2.resize(width, height)
            await transparent.writeAsync(`${filepath}/caption.png`)
            await transparent2.writeAsync(`${filepath}/caption2.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/caption.png -i ${filepath}/caption2.png -filter_complex "[0:v][1:v]overlay=x=0:y=0:format=auto[caption];[caption][2:v]overlay=x=0:y=0:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var transparent = await poopy.modules.Jimp.read('assets/transparent.png')
            var impact = await poopy.modules.Jimp.loadFont('assets/fonts/Impact/Impact.fnt')
            transparent.resize(width, height)
            transparent.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var transparent2 = transparent.clone()
            await transparent.print(impact, 20, 20, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, transparent.bitmap.width - 40, transparent.bitmap.height - 40)
            await transparent2.print(impact, 20, 20, { text: poopy.modules.Discord.Util.cleanContent(text2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_BOTTOM }, transparent.bitmap.width - 40, transparent.bitmap.height - 40)
            transparent.resize(width, height)
            transparent2.resize(width, height)
            await transparent.writeAsync(`${filepath}/caption.png`)
            await transparent2.writeAsync(`${filepath}/caption2.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/caption.png -i ${filepath}/caption2.png -map 0:a? -filter_complex "[0:v][1:v]overlay=x=0:y=0:format=auto[caption];[caption][2:v]overlay=x=0:y=0:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var transparent = await poopy.modules.Jimp.read('assets/transparent.png')
            var impact = await poopy.modules.Jimp.loadFont('assets/fonts/Impact/Impact.fnt')
            transparent.resize(width, height)
            transparent.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var transparent2 = transparent.clone()
            await transparent.print(impact, 20, 20, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, transparent.bitmap.width - 40, transparent.bitmap.height - 40)
            await transparent2.print(impact, 20, 20, { text: poopy.modules.Discord.Util.cleanContent(text2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_BOTTOM }, transparent.bitmap.width - 40, transparent.bitmap.height - 40)
            transparent.resize(width, height)
            transparent2.resize(width, height)
            await transparent.writeAsync(`${filepath}/caption.png`)
            await transparent2.writeAsync(`${filepath}/caption2.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/caption.png -i ${filepath}/caption2.png -filter_complex "[0:v][1:v]overlay=x=0:y=0:format=auto[caption];[caption][2:v]overlay=x=0:y=0:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'meme "{topText}" "[bottomText]" {file} [-size <multiplier (from 0.5 to 5)>]',
        value: 'Adds a meme caption to the file.'
    },
    cooldown: 2500,
    type: 'Captions'
}