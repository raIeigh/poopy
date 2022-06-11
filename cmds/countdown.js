module.exports = {
    name: ['countdown', 'annoyingorange'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
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
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/)
        if (!matchedTextes) {
            matchedTextes = ['""', '']
        }
        var text = matchedTextes[1]
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
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
            var transparent = await poopy.modules.Jimp.read(`assets/transparent.png`)
            var novecento = await poopy.modules.Jimp.loadFont(`assets/fonts/Novecento/Novecento.fnt`)
            transparent.resize(101, 28)
            await transparent.print(novecento, 0, 0, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 101, 28)
            await transparent.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vf "scale=66:66" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/scaled.mp4`)
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/scaled.mp4 -i ${filepath}/caption.png -i assets/countdown.mp4 -filter_complex "[2:v][0:v]overlay=shortest=1:x=2:y=3:format=auto[image];[image][1:v]overlay=x=89:y=4:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`
            var transparent = await poopy.modules.Jimp.read(`assets/transparent.png`)
            var novecento = await poopy.modules.Jimp.loadFont(`assets/fonts/Novecento/Novecento.fnt`)
            transparent.resize(101, 28)
            await transparent.print(novecento, 0, 0, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 101, 28)
            await transparent.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vf "scale=66:66" -preset ${poopy.functions.findpreset(args)} ${filepath}/scaled.png`)
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/scaled.png -i ${filepath}/caption.png -i assets/countdown.mp4 -filter_complex "[2:v][0:v]overlay=shortest=1:x=2:y=3:format=auto[image];[image][1:v]overlay=x=89:y=4:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var transparent = await poopy.modules.Jimp.read(`assets/transparent.png`)
            var novecento = await poopy.modules.Jimp.loadFont(`assets/fonts/Novecento/Novecento.fnt`)
            transparent.resize(101, 28)
            await transparent.print(novecento, 0, 0, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 101, 28)
            await transparent.writeAsync(`${filepath}/caption.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=66:66,split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/scaled.gif`)
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/scaled.gif -i ${filepath}/caption.png -i assets/countdown.mp4 -filter_complex "[2:v][0:v]overlay=shortest=1:x=2:y=3:format=auto[image];[image][1:v]overlay=x=89:y=4:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
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
    help: { name: 'countdown/annoyingorange "{name}" <file>', value: 'oh no' },
    cooldown: 2500,
    type: 'Memes'
}