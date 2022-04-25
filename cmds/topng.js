module.exports = {
    name: ['topng', 'getframe', 'extractframe'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video') || type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            var frames = fileinfo.info.frames

            var pos = 1
            var posindex = args.indexOf('-framepos')
            if (posindex > -1) {
                pos = isNaN(Number(args[posindex + 1])) ? 1 : Number(args[posindex + 1]) <= 1 ? 1 : Number(args[posindex + 1]) >= frames ? frames : Math.round(Number(args[posindex + 1])) || 1
            }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]select='eq(n,${pos - 1})'[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
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
        name: 'topng/getframe/extractframe <video/gif> [-framepos <number>]',
        value: 'Converts the video/GIF to a static PNG. Specifying the framepos param extracts the frame in the file with that position.'
    },
    cooldown: 2500,
    type: 'Conversion'
}