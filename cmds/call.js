module.exports = {
    name: ['call', 'phonecall'],
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
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/)
        if (!matchedTextes) {
            matchedTextes = ['""', '']
        }
        var text = matchedTextes[1]
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

            var call = await poopy.modules.Jimp.read(`assets/call.png`)
            var helvetica = await poopy.modules.Jimp.loadFont('assets/fonts/HelveticaLight/HelveticaLight.fnt')
            await call.print(helvetica, 20, 59, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 333, 155)
            await call.writeAsync(`${filepath}/call.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var ratio = width / height
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 assets/call.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])
            var bratio = bwidth / bheight

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/call.png -i assets/callbg.png -filter_complex "[0:v]scale=${ratio < bratio ? bwidth : ratio > bratio ? -1 : bwidth}:${ratio < bratio ? -1 : ratio > bratio ? bheight : bheight}[frame];[2:v][frame]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[bg];[bg][1:v]overlay=x=0:y=0:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`

            var call = await poopy.modules.Jimp.read(`assets/call.png`)
            var helvetica = await poopy.modules.Jimp.loadFont('assets/fonts/HelveticaLight/HelveticaLight.fnt')
            await call.print(helvetica, 20, 59, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 333, 155)
            await call.writeAsync(`${filepath}/call.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var ratio = width / height
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 assets/call.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])
            var bratio = bwidth / bheight

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/call.png -i assets/callbg.png -map 0:a? -filter_complex "[0:v]scale=${ratio < bratio ? bwidth : ratio > bratio ? -1 : bwidth}:${ratio < bratio ? -1 : ratio > bratio ? bheight : bheight}[frame];[2:v][frame]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[bg];[bg][1:v]overlay=x=0:y=0:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`

            var call = await poopy.modules.Jimp.read(`assets/call.png`)
            var helvetica = await poopy.modules.Jimp.loadFont('assets/fonts/HelveticaLight/HelveticaLight.fnt')
            await call.print(helvetica, 20, 59, { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_TOP }, 333, 155)
            await call.writeAsync(`${filepath}/call.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var ratio = width / height
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 assets/call.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])
            var bratio = bwidth / bheight

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/call.png -i assets/callbg.png -filter_complex "[0:v]scale=${ratio < bratio ? bwidth : ratio > bratio ? -1 : bwidth}:${ratio < bratio ? -1 : ratio > bratio ? bheight : bheight}[frame];[2:v][frame]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[bg];[bg][1:v]overlay=x=0:y=0:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'call/phonecall "[name]" <file>',
        value: 'Poopy is calling.'
    },
    cooldown: 2500,
    type: 'Memes'
}