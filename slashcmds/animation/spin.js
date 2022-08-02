module.exports = {
    name: ['spin'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var duration = 1
        var durationindex = args.indexOf('-duration')
        if (durationindex > -1) {
            duration = isNaN(Number(args[durationindex + 1])) ? 1 : Number(args[durationindex + 1]) <= 0.1 ? 0.1 : Number(args[durationindex + 1]) >= 10 ? 10 : Number(args[durationindex + 1]) || 1
        }
        var currenturl = poopy.functions.lastUrl(msg, 0)
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`)
            var filename = `input.gif`
            await poopy.functions.execPromise(`ffmpeg -r 50 -stream_loop -1 -t ${duration} -i ${filepath}/${filename} -filter_complex "[0:v]scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,rotate=t/${duration}*360*PI/180:ow='max(iw,ih)':oh=max'(iw,ih)':c=0x00000000,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting -r 50 -t ${duration} ${filepath}/output.gif`)
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
        name: 'spin <file> [-duration <seconds (max 10)>]',
        value: 'Continuously spins the file.'
    },
    cooldown: 2500,
    type: 'Animation'
}