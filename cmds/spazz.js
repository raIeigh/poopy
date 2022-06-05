module.exports = {
    name: ['spazz', 'shake'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var seed = Math.random() * 1000
        var seedindex = args.indexOf('-seed')
        if (seedindex > -1) {
            seed = isNaN(Number(args[seedindex + 1])) ? Math.random() * 1000 : Number(args[seedindex + 1]) || Math.random() * 1000
        }
        var radius = 50
        var radiusindex = args.indexOf('-radius')
        if (radiusindex > -1) {
            radius = isNaN(Number(args[radiusindex + 1])) ? 50 : Number(args[radiusindex + 1]) <= 0 ? 0 : Number(args[radiusindex + 1]) ?? 50
        }
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            await poopy.functions.execPromise(`ffmpeg ${!(poopy.vars.gifFormats.find(f => f === type.ext)) ? `-r 50 -stream_loop -1 -t 2 ` : ''}-i ${filepath}/${filename} ${!(poopy.vars.gifFormats.find(f => f === type.ext)) ? `-r 50 -stream_loop -1 -t 2 ` : ''}-i assets/transparent.png -filter_complex "[1:v][0:v]scale2ref${args.find(arg => arg === '-rescale') ? `=w=iw+${radius}:h=ih+${radius}` : ''}[transparent][overlay];[transparent][overlay]overlay=x=(W-w)/2+${radius / 2}-random(t*(random(0)*${seed}))*${radius}:y=(H-h)/2+${radius / 2}-random(t*(random(0)*${seed}))*${radius}:format=auto,scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -aspect ${width}:${height} -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/transparent.png -filter_complex "[1:v][0:v]scale2ref${args.find(arg => arg === '-rescale') ? `=w=iw+${radius}:h=ih+${radius}` : ''}[transparent][overlay];[transparent][overlay]overlay=x=(W-w)/2+${radius / 2}-random(t*(random(0)*${seed}))*${radius}:y=(H-h)/2+${radius / 2}-random(t*(random(0)*${seed}))*${radius}:format=auto[out]" -map "[out]" -map 0:a? -c:v libx264 -pix_fmt yuv420p -aspect ${width}:${height} -preset ${poopy.functions.findpreset(args)} ${filepath}/output.mp4`)
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
    help: {
        name: 'spazz/shake <file> [-radius <number>] [-seed <number>] [-rescale]',
        value: 'Makes the file spazz out.'
    },
    cooldown: 2500,
    type: 'Animation'
}