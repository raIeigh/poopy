module.exports = {
    name: ['amazon'],
    args: [{"name":"name","required":false,"specifarg":false},{"name":"price","required":false,"specifarg":false},{"name":"rating","required":false,"specifarg":false},{"name":"file","required":false,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && poopy.vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var saidMessage = args.slice(1).join(' ')
        poopy.vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var dft = ['""', '"19.99"', '"4.5"']
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/g)
        if (!matchedTextes) {
            matchedTextes = dft
        } else {
            for (var i in dft) {
                var dfttext = dft[i]
                var text = matchedTextes[i]
                if (!text) {
                    matchedTextes[i] = dfttext
                }
            }
        }
        var name = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
        var price = matchedTextes[1].substring(1, matchedTextes[1].length - 1)
        var price1 = price.split('.')[0]
        var price2 = price.split('.')[1] || '00'
        var rating = matchedTextes[2].substring(1, matchedTextes[2].length - 1)
        var numberrating = isNaN(Number(rating)) ? 4.5 : Number(rating) <= 0 ? 0 : Number(rating) >= 5 ? 5 : Number(rating) || 0
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

            var amazon = await poopy.modules.Jimp.read(`assets/amazon.png`)
            var ystars = await poopy.modules.Jimp.read(`assets/ystars.png`)
            var wstars = await poopy.modules.Jimp.read(`assets/wstars.png`)
            var amazonemlink = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberLink/AmazonEmberLink.fnt')
            var amazonemsmall = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberSmall/AmazonEmberSmall.fnt')
            var amazonembig = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberBig/AmazonEmberBig.fnt')
            ystars.crop(0, 0, ystars.bitmap.width * (numberrating / 5), ystars.bitmap.height)
            wstars.composite(ystars, 0, 0)
            amazon.composite(wstars, 16, 299)
            await amazon.print(amazonemlink, 14, 219, { text: poopy.modules.Discord.Util.cleanContent(name, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 209, 49)
            await amazon.print(amazonembig, 22, 275, { text: poopy.modules.Discord.Util.cleanContent(price1, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_RIGHT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 36, 18)
            await amazon.print(amazonemsmall, 60, 275, { text: poopy.modules.Discord.Util.cleanContent(price2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 20, 12)
            await amazon.writeAsync(`${filepath}/amazon.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/amazon.png -filter_complex "[0:v]scale=${squareS.constraint === 'width' || squareS.constraint === 'both' ? 184 : -1}:${squareS.constraint === 'height' || squareS.constraint === 'both' ? 184 : -1}[frame];[1:v][frame]overlay=x=26+(184/2-w/2):y=22+(184/2-h/2):format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`

            var amazon = await poopy.modules.Jimp.read(`assets/amazon.png`)
            var ystars = await poopy.modules.Jimp.read(`assets/ystars.png`)
            var wstars = await poopy.modules.Jimp.read(`assets/wstars.png`)
            var amazonemlink = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberLink/AmazonEmberLink.fnt')
            var amazonemsmall = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberSmall/AmazonEmberSmall.fnt')
            var amazonembig = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberBig/AmazonEmberBig.fnt')
            ystars.crop(0, 0, ystars.bitmap.width * (numberrating / 5), ystars.bitmap.height)
            wstars.composite(ystars, 0, 0)
            amazon.composite(wstars, 16, 299)
            await amazon.print(amazonemlink, 14, 219, { text: poopy.modules.Discord.Util.cleanContent(name, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 209, 49)
            await amazon.print(amazonembig, 22, 275, { text: poopy.modules.Discord.Util.cleanContent(price1, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_RIGHT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 36, 18)
            await amazon.print(amazonemsmall, 60, 275, { text: poopy.modules.Discord.Util.cleanContent(price2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 20, 12)
            await amazon.writeAsync(`${filepath}/amazon.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/amazon.png -map 0:a? -filter_complex "[0:v]scale=${squareS.constraint === 'width' || squareS.constraint === 'both' ? 184 : -1}:${squareS.constraint === 'height' || squareS.constraint === 'both' ? 184 : -1}[frame];[1:v][frame]overlay=x=26+(184/2-w/2):y=22+(184/2-h/2):format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`

            var amazon = await poopy.modules.Jimp.read(`assets/amazon.png`)
            var ystars = await poopy.modules.Jimp.read(`assets/ystars.png`)
            var wstars = await poopy.modules.Jimp.read(`assets/wstars.png`)
            var amazonemlink = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberLink/AmazonEmberLink.fnt')
            var amazonemsmall = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberSmall/AmazonEmberSmall.fnt')
            var amazonembig = await poopy.modules.Jimp.loadFont('assets/fonts/AmazonEmberBig/AmazonEmberBig.fnt')
            ystars.crop(0, 0, ystars.bitmap.width * (numberrating / 5), ystars.bitmap.height)
            wstars.composite(ystars, 0, 0)
            amazon.composite(wstars, 16, 299)
            await amazon.print(amazonemlink, 14, 219, { text: poopy.modules.Discord.Util.cleanContent(name, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 209, 49)
            await amazon.print(amazonembig, 22, 275, { text: poopy.modules.Discord.Util.cleanContent(price1, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_RIGHT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 36, 18)
            await amazon.print(amazonemsmall, 60, 275, { text: poopy.modules.Discord.Util.cleanContent(price2, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 20, 12)
            await amazon.writeAsync(`${filepath}/amazon.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/amazon.png -filter_complex "[0:v]scale=${squareS.constraint === 'width' || squareS.constraint === 'both' ? 184 : -1}:${squareS.constraint === 'height' || squareS.constraint === 'both' ? 184 : -1}[frame];[1:v][frame]overlay=x=26+(184/2-w/2):y=22+(184/2-h/2):format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'amazon "{name}" "[price]" "[rating (in stars)]" {file}',
        value: 'Now ON SALE!!!'
    },
    cooldown: 2500,
    type: 'Memes'
}