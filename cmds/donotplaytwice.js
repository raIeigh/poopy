module.exports = {
    name: ['donotplaytwice', 'playtwice'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
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
            var audio = fileinfo.info.audio

            if (audio) {
                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vn -map_metadata -1 -c:a libvorbis -b:a 64k -ar 44100 -preset ${poopy.functions.findpreset(args)} ${filepath}/44100.ogg`)

                await poopy.functions.execPromise(`cat assets/donotplaytwice.ogg ${filepath}/44100.ogg assets/silence.ogg > ${filepath}/output.ogg`)

                await poopy.functions.sendFile(msg, filepath, `output.ogg`)
            } else {
                await msg.channel.send('No audio stream detected.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vn -map_metadata -1 -c:a libvorbis -b:a 64k -ar 44100 -preset ${poopy.functions.findpreset(args)} ${filepath}/44100.ogg`)

            await poopy.functions.execPromise(`cat assets/donotplaytwice.ogg ${filepath}/44100.ogg assets/silence.ogg > ${filepath}/output.ogg`)

            await poopy.functions.sendFile(msg, filepath, `output.ogg`)
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
        name: 'donotplaytwice/playtwice <audio/video>',
        value: `Creates a "DO NOT PLAY THIS AUDIO TWICE" ogg with the audio. Probably doesn't work now...`
    },
    cooldown: 2500,
    type: 'Hex Manipulation'
}
