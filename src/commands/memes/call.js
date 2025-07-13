module.exports = {
    name: ['call', 'phonecall'],
    args: [{"name":"name","required":false,"specifarg":false,"orig":"\"[name]\""},{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let vars = poopy.vars
        let { Jimp, Discord } = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && vars.validUrl.test(args[args.length - 1]) === false) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var saidMessage = args.slice(1).join(' ')
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/)
        if (!matchedTextes) {
            matchedTextes = ['""', '']
        }
        var text = matchedTextes[1]
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo            })
            var filename = `input.png`

            var call = await Jimp.read(`assets/image/call.png`)
            var helvetica = await Jimp.loadFont('assets/fonts/HelveticaLight/HelveticaLight.fnt')
            await call.print(helvetica, 20, 59, { text: Discord.Util.cleanContent(text, msg), alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_TOP }, 333, 155)
            await call.writeAsync(`${filepath}/call.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var ratio = width / height
            var bscale = await execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 assets/image/call.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])
            var bratio = bwidth / bheight

            await execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/call.png -i assets/image/callbg.png -filter_complex "[0:v]scale=${ratio < bratio ? bwidth : ratio > bratio ? -1 : bwidth}:${ratio < bratio ? -1 : ratio > bratio ? bheight : bheight}[frame];[2:v][frame]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[bg];[bg][1:v]overlay=x=0:y=0:format=auto[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo            })
            var filename = `input.mp4`

            var call = await Jimp.read(`assets/image/call.png`)
            var helvetica = await Jimp.loadFont('assets/fonts/HelveticaLight/HelveticaLight.fnt')
            await call.print(helvetica, 20, 59, { text: Discord.Util.cleanContent(text, msg), alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_TOP }, 333, 155)
            await call.writeAsync(`${filepath}/call.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var ratio = width / height
            var bscale = await execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 assets/image/call.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])
            var bratio = bwidth / bheight

            await execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/call.png -i assets/image/callbg.png -map 0:a? -filter_complex "[0:v]scale=${ratio < bratio ? bwidth : ratio > bratio ? -1 : bwidth}:${ratio < bratio ? -1 : ratio > bratio ? bheight : bheight}[frame];[2:v][frame]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[bg];[bg][1:v]overlay=x=0:y=0:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`

            var call = await Jimp.read(`assets/image/call.png`)
            var helvetica = await Jimp.loadFont('assets/fonts/HelveticaLight/HelveticaLight.fnt')
            await call.print(helvetica, 20, 59, { text: Discord.Util.cleanContent(text, msg), alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_TOP }, 333, 155)
            await call.writeAsync(`${filepath}/call.png`)

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var ratio = width / height
            var bscale = await execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 assets/image/call.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])
            var bratio = bwidth / bheight

            await execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/call.png -i assets/image/callbg.png -filter_complex "[0:v]scale=${ratio < bratio ? bwidth : ratio > bratio ? -1 : bwidth}:${ratio < bratio ? -1 : ratio > bratio ? bheight : bheight}[frame];[2:v][frame]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[bg];[bg][1:v]overlay=x=0:y=0:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'call/phonecall "[name]" {file}',
        value: 'Poopy is calling.'
    },
    cooldown: 2500,
    type: 'Memes'
}