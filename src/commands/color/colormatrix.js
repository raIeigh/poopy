module.exports = {
    name: ['colormatrix', 'colorchannels'],
    args: [{name: "matrix",required: false,specifarg: false,orig: "\"{matrix}\""},{name: "file",required: false,specifarg: false,orig: "{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let {
            lastUrl, validateFile, downloadFile, execPromise,
            findpreset, sendFile, fetchPingPerms
        } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let vars = poopy.vars

        msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[4] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var saidMessage = args.slice(1).join(' ').replace(/’/g, '\'')
        vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/g)
        if (!matchedTextes) {
            matchedTextes = ['""']
        }

        var matrix = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
            .replace(/[^0-9.:-]/g, '').split(":")
            .slice(0, 16).join(":")
        var currenturl = lastUrl(msg, 0)
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply({
                content: error,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        console.log("poop 1:", matchedTextes[0])
        console.log("poop 2:", matchedTextes[0].substring(1, matchedTextes[0].length - 1))
        console.log("poop 3:", matchedTextes[0].substring(1, matchedTextes[0].length - 1).replace(/[^0-9.:-]/g, ''))
        console.log("poop 4:", matchedTextes[0].substring(1, matchedTextes[0].length - 1).replace(/[^0-9.:-]/g, '').split(":"))
        console.log("poop 5:", matchedTextes[0].substring(1, matchedTextes[0].length - 1).replace(/[^0-9.:-]/g, '').split(":").splice(16))
        console.log("poop 6:", matchedTextes[0].substring(1, matchedTextes[0].length - 1).replace(/[^0-9.:-]/g, '').split(":").splice(16).join(":"))

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo            })
            var filename = `input.png`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]colorchannelmixer=${matrix}[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo            })
            var filename = `input.mp4`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]colorchannelmixer=${matrix},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`, {
                fileinfo            })
            var filename = `input.gif`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]colorchannelmixer=${matrix},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'colormatrix/colorchannels "{matrix}" {file}',
        value: 'Adjusts the file by re-mixing color channels. More info found at https://ffmpeg.org/ffmpeg-filters.html#colorchannelmixer\n' +
            'Example usage: p:colormatrix "0.500765:0.170934:0.227954:0:0.259265:0.686995:-0.045912:0:-0.288881:0.650426:0.539569" (deltarune second sanctuary filter)'
    },
    cooldown: 2500,
    type: 'Effects'
}