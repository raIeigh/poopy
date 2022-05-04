module.exports = {
    name: ['tospectrogram', 'spectrogramimage'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[2] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var duration = 6
        var durationindex = args.indexOf('-duration')
        if (durationindex > -1) {
            duration = isNaN(Number(args[durationindex + 1])) ? 6 : Number(args[durationindex + 1]) <= 1 ? 1 : Number(args[durationindex + 1]) >= 20 ? 20 : Number(args[durationindex + 1]) || 6
        }
        var frequency = 20000
        var frequencyindex = args.indexOf('-frequency')
        if (frequencyindex > -1) {
            frequency = isNaN(Number(args[frequencyindex + 1])) ? 20000 : Number(args[frequencyindex + 1]) <= 20 ? 20 : Number(args[frequencyindex + 1]) >= 40000 ? 40000 : Math.round(Number(args[frequencyindex + 1])) || 20000
        }
        var density = 1
        var densityindex = args.indexOf('-density')
        if (densityindex > -1) {
            density = isNaN(Number(args[densityindex + 1])) ? 1 : Number(args[densityindex + 1]) <= 1 ? 1 : Number(args[densityindex + 1]) >= 10 ? 10 : Number(args[densityindex + 1]) || 1
        }
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var currentcount = poopy.vars.filecount
            poopy.vars.filecount++
            var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            poopy.modules.fs.mkdirSync(`${filepath}`)

            var spectrogramData = await poopy.functions.spectrogram(currenturl, {
                o_length: duration,
                o_freq: frequency,
                o_factor: density
            }).catch(() => { })

            poopy.modules.fs.writeFileSync(`${filepath}/output.wav`, spectrogramData)

            await poopy.functions.sendFile(msg, filepath, `output.wav`)
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
        name: 'tospectrogram/spectrogramimage <file> [-duration <seconds (from 1 to 20)>] [-frequency <hz (from 20 to 40000)>] [-density <number (from 1 to 10)>]',
        value: 'Generates a new WAV from the image. When you view its spectrogram, the image will be there! (`spectrogram` command)'
    },
    cooldown: 2500,
    type: 'Audio'
}