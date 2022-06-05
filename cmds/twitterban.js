module.exports = {
    name: ['twitterban'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && poopy.vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var saidMessage = args.join(' ').substring(args[0].length + 1)
        poopy.vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var dft = ['""', `"${msg.member.nickname || msg.author.username}"`, `"${msg.author.username}"`]
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
        var message = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
        var nickname = matchedTextes[1].substring(1, matchedTextes[1].length - 1)
        var username = '@' + matchedTextes[2].substring(1, matchedTextes[2].length - 1)
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

            var twitter = await poopy.modules.Jimp.read(`assets/twitter.png`)
            var tnr = await poopy.modules.Jimp.loadFont('assets/fonts/TimesNewRoman/TimesNewRoman.fnt')
            var arialbold = await poopy.modules.Jimp.loadFont('assets/fonts/ArialBold/ArialBold.fnt')
            var arialblue = await poopy.modules.Jimp.loadFont('assets/fonts/ArialBlue/ArialBlue.fnt')
            await twitter.print(tnr, 85, 437, { text: poopy.modules.Discord.Util.cleanContent(message, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 546, 21)
            await twitter.print(arialbold, 116, 131, { text: poopy.modules.Discord.Util.cleanContent(nickname, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 614, 12)
            await twitter.print(arialbold, 143, 379, { text: poopy.modules.Discord.Util.cleanContent(nickname, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 490, 12)
            await twitter.print(arialblue, 116, 147, { text: poopy.modules.Discord.Util.cleanContent(username, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 614, 12)
            await twitter.print(arialblue, 143, 395, { text: poopy.modules.Discord.Util.cleanContent(username, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 490, 12)
            await twitter.writeAsync(`${filepath}/twitter.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/twitter.png -i assets/twitterbg.png -filter_complex "[2:v][1:v]scale2ref[bg][twitter];${squareS.constraint !== 'both' ? `[0:v]crop=x=${squareS.constraint === 'height' ? 0 : 'iw/2-ih/2'}:y=${squareS.constraint === 'width' ? 0 : 'ih/2-iw/2'}:w=${squareS.constraint === 'width' ? 'ih' : 'iw'}:h=${squareS.constraint === 'height' ? 'iw' : 'ih'}[cframe];` : ''}[${squareS.constraint !== 'both' ? 'cframe' : '0:v'}]scale=48:48,split[frame][frame2];[bg][frame]overlay=x=59:y=134:format=auto[bframe];[bframe][frame2]overlay=x=86:y=382:format=auto[bbframe];[bbframe][twitter]overlay=x=0:y=0:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`

            var twitter = await poopy.modules.Jimp.read(`assets/twitter.png`)
            var tnr = await poopy.modules.Jimp.loadFont('assets/fonts/TimesNewRoman/TimesNewRoman.fnt')
            var arialbold = await poopy.modules.Jimp.loadFont('assets/fonts/ArialBold/ArialBold.fnt')
            var arialblue = await poopy.modules.Jimp.loadFont('assets/fonts/ArialBlue/ArialBlue.fnt')
            await twitter.print(tnr, 85, 437, { text: poopy.modules.Discord.Util.cleanContent(message, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 546, 21)
            await twitter.print(arialbold, 116, 131, { text: poopy.modules.Discord.Util.cleanContent(nickname, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 614, 12)
            await twitter.print(arialbold, 143, 379, { text: poopy.modules.Discord.Util.cleanContent(nickname, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 490, 12)
            await twitter.print(arialblue, 116, 147, { text: poopy.modules.Discord.Util.cleanContent(username, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 614, 12)
            await twitter.print(arialblue, 143, 395, { text: poopy.modules.Discord.Util.cleanContent(username, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 490, 12)
            await twitter.writeAsync(`${filepath}/twitter.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/twitter.png -i assets/twitterbg.png -map 0:a? -filter_complex "[2:v][1:v]scale2ref[bg][twitter];${squareS.constraint !== 'both' ? `[0:v]crop=x=${squareS.constraint === 'height' ? 0 : 'iw/2-ih/2'}:y=${squareS.constraint === 'width' ? 0 : 'ih/2-iw/2'}:w=${squareS.constraint === 'width' ? 'ih' : 'iw'}:h=${squareS.constraint === 'height' ? 'iw' : 'ih'}[cframe];` : ''}[${squareS.constraint !== 'both' ? 'cframe' : '0:v'}]scale=48:48,split[frame][frame2];[bg][frame]overlay=x=59:y=134:format=auto[bframe];[bframe][frame2]overlay=x=86:y=382:format=auto[bbframe];[bbframe][twitter]overlay=x=0:y=0:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -aspect ${twitter.bitmap.width}:${twitter.bitmap.height} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`

            var twitter = await poopy.modules.Jimp.read(`assets/twitter.png`)
            var tnr = await poopy.modules.Jimp.loadFont('assets/fonts/TimesNewRoman/TimesNewRoman.fnt')
            var arialbold = await poopy.modules.Jimp.loadFont('assets/fonts/ArialBold/ArialBold.fnt')
            var arialblue = await poopy.modules.Jimp.loadFont('assets/fonts/ArialBlue/ArialBlue.fnt')
            await twitter.print(tnr, 85, 437, { text: poopy.modules.Discord.Util.cleanContent(message, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 546, 21)
            await twitter.print(arialbold, 116, 131, { text: poopy.modules.Discord.Util.cleanContent(nickname, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 614, 12)
            await twitter.print(arialbold, 143, 379, { text: poopy.modules.Discord.Util.cleanContent(nickname, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 490, 12)
            await twitter.print(arialblue, 116, 147, { text: poopy.modules.Discord.Util.cleanContent(username, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 614, 12)
            await twitter.print(arialblue, 143, 395, { text: poopy.modules.Discord.Util.cleanContent(username, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 490, 12)
            await twitter.writeAsync(`${filepath}/twitter.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/twitter.png -i assets/twitterbg.png -filter_complex "[2:v][1:v]scale2ref[bg][twitter];${squareS.constraint !== 'both' ? `[0:v]crop=x=${squareS.constraint === 'height' ? 0 : 'iw/2-ih/2'}:y=${squareS.constraint === 'width' ? 0 : 'ih/2-iw/2'}:w=${squareS.constraint === 'width' ? 'ih' : 'iw'}:h=${squareS.constraint === 'height' ? 'iw' : 'ih'}[cframe];` : ''}[${squareS.constraint !== 'both' ? 'cframe' : '0:v'}]scale=48:48,split[frame][frame2];[bg][frame]overlay=x=59:y=134:format=auto[bframe];[bframe][frame2]overlay=x=86:y=382:format=auto[bbframe];[bbframe][twitter]overlay=x=0:y=0:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -aspect ${twitter.bitmap.width}:${twitter.bitmap.height} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'twitterban "{message}" "{nickname}" "{username}" <file>',
        value: 'banned for hating Pan | They/Them | #BLM | #ACAB | #GAYRIGHTS | #ProudPansexual | #ProudNon-Binary | #LGBTQRIGHTS | Hates Straights'
    },
    cooldown: 2500,
    type: 'Memes'
}