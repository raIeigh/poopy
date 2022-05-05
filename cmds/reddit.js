module.exports = {
    name: ['reddit'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
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
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var reddittop = await poopy.modules.Jimp.read(`templates/reddittop.png`)
            var ibm = await poopy.modules.Jimp.loadFont(`templates/fonts/IBMPlexSans/IBMPlexSans.fnt`)
            await reddittop.print(ibm, 18, 315, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 364, 66)
            await reddittop.writeAsync(`${filepath}/top.png`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=${reddittop.bitmap.width}:-1[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/scaled.png`)
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/top.png -i ${filepath}/scaled.png -i templates/redditbottom.png -i templates/redditbg.png -filter_complex "vstack=inputs=3[transparent];[3:v][transparent]scale2ref[bg][transparent2];[bg][transparent2]overlay=x=0:y=0:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`

            var reddittop = await poopy.modules.Jimp.read(`templates/reddittop.png`)
            var redditbottom = await poopy.modules.Jimp.read(`templates/redditbottom.png`)
            var ibm = await poopy.modules.Jimp.loadFont(`templates/fonts/IBMPlexSans/IBMPlexSans.fnt`)
            await reddittop.print(ibm, 18, 315, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 364, 66)
            await reddittop.writeAsync(`${filepath}/top.png`)

            var fps = fileinfo.info.fps

            await poopy.functions.execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]scale=${reddittop.bitmap.width}:-1,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/scaled.mp4`)
            var scale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/scaled.mp4`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            var width = Number(scale[0])
            var height = Number(scale[1])

            await poopy.functions.execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/top.png -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/scaled.mp4 -r ${fps.includes('0/0') ? '50' : fps} -i templates/redditbottom.png -i templates/redditbg.png -map 1:a? -filter_complex "vstack=inputs=3[transparent];[3:v][transparent]scale2ref[bg][transparent2];[bg][transparent2]overlay=x=0:y=0:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -aspect ${width}:${reddittop.bitmap.height + height + redditbottom.bitmap.height} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`

            var reddittop = await poopy.modules.Jimp.read(`templates/reddittop.png`)
            var ibm = await poopy.modules.Jimp.loadFont(`templates/fonts/IBMPlexSans/IBMPlexSans.fnt`)
            await reddittop.print(ibm, 18, 315, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_LEFT, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 364, 66)
            await reddittop.writeAsync(`${filepath}/top.png`)

            var fps = fileinfo.info.fps

            await poopy.functions.execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -filter_complex "[0:v]scale=${reddittop.bitmap.width}:-1,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/scaled.gif`)
            var scale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/scaled.gif`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            var width = Number(scale[0])
            var height = Number(scale[1])

            await poopy.functions.execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/top.png -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/scaled.gif -r ${fps.includes('0/0') ? '50' : fps} -i templates/redditbottom.png -i templates/redditbg.png -filter_complex "vstack=inputs=3[transparent];[3:v][transparent]scale2ref[bg][transparent2];[bg][transparent2]overlay=x=0:y=0:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -aspect ${width}:${reddittop.bitmap.height + height + redditbottom.bitmap.height} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'reddit {name} <file>',
        value: 'The kind stranger has arrived.'
    },
    cooldown: 2500,
    type: 'Memes'
}