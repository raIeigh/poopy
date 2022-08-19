module.exports = {
    name: ['piranha', 'appear'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"},{"name":"duration","required":false,"specifarg":true,"orig":"[-duration <seconds (max 20)>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var duration = 4
        var durationindex = args.indexOf('-duration')
        if (durationindex > -1) {
            duration = isNaN(Number(args[durationindex + 1])) ? 4 : Number(args[durationindex + 1]) <= 0.05 ? 0.05 : Number(args[durationindex + 1]) >= 20 ? 20 : Number(args[durationindex + 1]) || 4
        }
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
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
            await poopy.functions.execPromise(`ffmpeg -r 50 -stream_loop -1 -t ${duration} -i ${filepath}/${filename} -r 50 -stream_loop -1 -t ${duration} -i assets/transparent.png -filter_complex "[1:v][0:v]scale2ref[transparent][overlay];[transparent][overlay]overlay=x=(W-w)/2:y=H/2+cos(PI/2*(t*4/${duration}))*h/2:format=auto,scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -aspect ${width}:${height} -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting -r 50 -t ${duration} ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
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
        name: 'piranha/appear {file} [-duration <seconds (max 20)>]',
        value: 'Makes the file appear like the piranhas in Super Mario.'
    },
    cooldown: 2500,
    type: 'Animation'
}