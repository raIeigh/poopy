module.exports = {
    name: ['spectrogram'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0)
        var colors = [
            'channel',
            'intensity',
            'rainbow',
            'moreland',
            'nebulae',
            'fire',
            'fiery',
            'fruit',
            'cool',
            'magma',
            'green',
            'viridis',
            'plasma',
            'cividis',
            'terrain'
        ]
        var color = 'intensity'
        var colorindex = args.indexOf('-color')
        if (colorindex > -1) {
            if (colors.find(color => color === args[colorindex + 1].toLowerCase())) {
                color = args[colorindex + 1].toLowerCase()
            } else {
                await msg.channel.send('Not a supported color.').catch(() => { })
                return
            }
        }
        var scales = [
            'lin',
            'sqrt',
            'cbrt',
            'log',
            '4thrt',
            '5thrt'
        ]
        var scale = 'log'
        var scaleindex = args.indexOf('-scale')
        if (scaleindex > -1) {
            if (scales.find(scale => scale === args[scaleindex + 1].toLowerCase())) {
                scale = args[scaleindex + 1].toLowerCase()
            } else {
                await msg.channel.send('Not a supported scale.').catch(() => { })
                return
            }
        }
        var saturation = 1
        var saturationindex = args.indexOf('-saturation')
        if (saturationindex > -1) {
            saturation = isNaN(Number(args[saturationindex + 1])) ? 1 : Number(args[saturationindex + 1]) <= -10 ? -10 : Number(args[saturationindex + 1]) >= 10 ? 10 : Number(args[saturationindex + 1]) ?? 1
        }
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
                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -lavfi "showspectrumpic=size=1280x512:mode=separate:color=${color}:scale=${scale}:saturation=${saturation}" ${filepath}/output.png`)
                return await poopy.functions.sendFile(msg, filepath, `output.png`)
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

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -lavfi "showspectrumpic=size=1280x512:mode=separate:color=${color}:scale=${scale}:saturation=${saturation}" ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
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
        name: 'spectrogram {file} [-color <mode>] [-scale <scale>] [-saturation <number (from -10 to 10)>]',
        value: 'Displays the spectrogram of the audio file. A list of options for color and scale can be found at https://ffmpeg.org/ffmpeg-filters.html#showspectrumpic'
    },
    cooldown: 2500,
    type: 'Audio'
}