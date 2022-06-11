module.exports = {
    name: ['meme2', 'demotivator', 'motivator'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && poopy.vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
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
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
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
            var black = await poopy.modules.Jimp.read('assets/black.png')
            var tnr = await poopy.modules.Jimp.loadFont('assets/fonts/TimesNewRomanBig/TimesNewRomanBig.fnt')
            var arial = await poopy.modules.Jimp.loadFont('assets/fonts/ArialSmallWhite/ArialSmallWhite.fnt')
            black.resize(width, height)
            black.resize(400, poopy.modules.Jimp.AUTO)
            var whiteborder = black.clone()
            var blackborder = black.clone()
            var textblack = black.clone()
            var text2black = black.clone()
            var bottomblack = black.clone()
            var bgblack = black.clone()
            whiteborder.invert()
            whiteborder.resize(whiteborder.bitmap.width + 8, whiteborder.bitmap.height + 8)
            blackborder.resize(blackborder.bitmap.width + 4, blackborder.bitmap.height + 4)
            black.resize(500, black.bitmap.height + 60)
            black.composite(whiteborder, black.bitmap.width / 2 - whiteborder.bitmap.width / 2, black.bitmap.height / 2 - whiteborder.bitmap.height / 2)
            black.composite(blackborder, black.bitmap.width / 2 - blackborder.bitmap.width / 2, black.bitmap.height / 2 - blackborder.bitmap.height / 2)
            await black.writeAsync(`${filepath}/border.png`)
            var textheight = poopy.modules.Jimp.measureTextHeight(tnr, text, 500 - 40)
            textblack.resize(500, textheight)
            await textblack.print(tnr, 20, 0, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, textblack.bitmap.width - 40, textblack.bitmap.height)
            var text2height = poopy.modules.Jimp.measureTextHeight(arial, text2, 500 - 40)
            text2black.resize(500, text2height + 10)
            await text2black.print(arial, 20, 5, { text: poopy.modules.Discord.Util.cleanContent(text2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, text2black.bitmap.width - 40, text2black.bitmap.height - 10)
            bottomblack.resize(500, 20)
            bgblack.resize(500, textblack.bitmap.height + text2black.bitmap.height + bottomblack.bitmap.height)
            bgblack.composite(textblack, 0, 0)
            bgblack.composite(text2black, 0, textblack.bitmap.height)
            bgblack.composite(bottomblack, 0, textblack.bitmap.height + text2black.bitmap.height)
            await bgblack.writeAsync(`${filepath}/captions.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/border.png -filter_complex "[0:v]scale=400:-1[scaled];[1:v][scaled]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/frame.png`)
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/frame.png -i ${filepath}/captions.png -filter_complex "vstack=inputs=2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var black = await poopy.modules.Jimp.read('assets/black.png')
            var tnr = await poopy.modules.Jimp.loadFont('assets/fonts/TimesNewRomanBig/TimesNewRomanBig.fnt')
            var arial = await poopy.modules.Jimp.loadFont('assets/fonts/ArialSmallWhite/ArialSmallWhite.fnt')
            black.resize(width, height)
            black.resize(400, poopy.modules.Jimp.AUTO)
            var whiteborder = black.clone()
            var blackborder = black.clone()
            var textblack = black.clone()
            var text2black = black.clone()
            var bottomblack = black.clone()
            var bgblack = black.clone()
            whiteborder.invert()
            whiteborder.resize(whiteborder.bitmap.width + 8, whiteborder.bitmap.height + 8)
            blackborder.resize(blackborder.bitmap.width + 4, blackborder.bitmap.height + 4)
            black.resize(500, black.bitmap.height + 60)
            black.composite(whiteborder, black.bitmap.width / 2 - whiteborder.bitmap.width / 2, black.bitmap.height / 2 - whiteborder.bitmap.height / 2)
            black.composite(blackborder, black.bitmap.width / 2 - blackborder.bitmap.width / 2, black.bitmap.height / 2 - blackborder.bitmap.height / 2)
            await black.writeAsync(`${filepath}/border.png`)
            var textheight = poopy.modules.Jimp.measureTextHeight(tnr, text, 500 - 40)
            textblack.resize(500, textheight)
            await textblack.print(tnr, 20, 0, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, textblack.bitmap.width - 40, textblack.bitmap.height)
            var text2height = poopy.modules.Jimp.measureTextHeight(arial, text2, 500 - 40)
            text2black.resize(500, text2height + 10)
            await text2black.print(arial, 20, 5, { text: poopy.modules.Discord.Util.cleanContent(text2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, text2black.bitmap.width - 40, text2black.bitmap.height - 10)
            bottomblack.resize(500, 20)
            bgblack.resize(500, textblack.bitmap.height + text2black.bitmap.height + bottomblack.bitmap.height)
            bgblack.composite(textblack, 0, 0)
            bgblack.composite(text2black, 0, textblack.bitmap.height)
            bgblack.composite(bottomblack, 0, textblack.bitmap.height + text2black.bitmap.height)
            await bgblack.writeAsync(`${filepath}/captions.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/border.png -map 0:a? -filter_complex "[0:v]scale=400:-1[scaled];[1:v][scaled]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/frame.mp4`)
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/frame.mp4 -i ${filepath}/captions.png -map 0:a? -filter_complex "vstack=inputs=2[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var black = await poopy.modules.Jimp.read('assets/black.png')
            var tnr = await poopy.modules.Jimp.loadFont('assets/fonts/TimesNewRomanBig/TimesNewRomanBig.fnt')
            var arial = await poopy.modules.Jimp.loadFont('assets/fonts/ArialSmallWhite/ArialSmallWhite.fnt')
            black.resize(width, height)
            black.resize(400, poopy.modules.Jimp.AUTO)
            var whiteborder = black.clone()
            var blackborder = black.clone()
            var textblack = black.clone()
            var text2black = black.clone()
            var bottomblack = black.clone()
            var bgblack = black.clone()
            whiteborder.invert()
            whiteborder.resize(whiteborder.bitmap.width + 8, whiteborder.bitmap.height + 8)
            blackborder.resize(blackborder.bitmap.width + 4, blackborder.bitmap.height + 4)
            black.resize(500, black.bitmap.height + 60)
            black.composite(whiteborder, black.bitmap.width / 2 - whiteborder.bitmap.width / 2, black.bitmap.height / 2 - whiteborder.bitmap.height / 2)
            black.composite(blackborder, black.bitmap.width / 2 - blackborder.bitmap.width / 2, black.bitmap.height / 2 - blackborder.bitmap.height / 2)
            await black.writeAsync(`${filepath}/border.png`)
            var textheight = poopy.modules.Jimp.measureTextHeight(tnr, text, 500 - 40)
            textblack.resize(500, textheight)
            await textblack.print(tnr, 20, 0, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, textblack.bitmap.width - 40, textblack.bitmap.height)
            var text2height = poopy.modules.Jimp.measureTextHeight(arial, text2, 500 - 40)
            text2black.resize(500, text2height + 10)
            await text2black.print(arial, 20, 5, { text: poopy.modules.Discord.Util.cleanContent(text2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, text2black.bitmap.width - 40, text2black.bitmap.height - 10)
            bottomblack.resize(500, 20)
            bgblack.resize(500, textblack.bitmap.height + text2black.bitmap.height + bottomblack.bitmap.height)
            bgblack.composite(textblack, 0, 0)
            bgblack.composite(text2black, 0, textblack.bitmap.height)
            bgblack.composite(bottomblack, 0, textblack.bitmap.height + text2black.bitmap.height)
            await bgblack.writeAsync(`${filepath}/captions.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/border.png -filter_complex "[0:v]scale=400:-1[scaled];[1:v][scaled]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/frame.gif`)
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/frame.gif -i ${filepath}/captions.png -filter_complex "vstack=inputs=2[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'meme2/demotivator/motivator "{topText}" "[bottomText]" <file>',
        value: 'Adds a demotivator caption to the file.'
    },
    cooldown: 2500,
    type: 'Captions'
}