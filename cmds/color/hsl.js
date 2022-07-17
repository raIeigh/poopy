module.exports = {
    name: ['hsl', 'hsv'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[4] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
        var hue = isNaN(Number(String(args[1]).replace(/,/g, ''))) ? 0 : Number(String(args[1]).replace(/,/g, '')) <= -360 ? -360 : Number(String(args[1]).replace(/,/g, '')) >= 360 ? 360 : Number(String(args[1]).replace(/,/g, '')) || 0
        var saturation = isNaN(Number(String(args[2]).replace(/,/g, ''))) ? 1 : Number(String(args[2]).replace(/,/g, '')) <= -10 ? -10 : Number(String(args[2]).replace(/,/g, '')) >= 10 ? 10 : Number(String(args[2]).replace(/,/g, '')) ?? 1
        var lightness = isNaN(Number(String(args[3]).replace(/,/g, ''))) ? 0 : Number(String(args[3]).replace(/,/g, '')) <= -10 ? -10 : Number(String(args[3]).replace(/,/g, '')) >= 10 ? 10 : Number(String(args[3]).replace(/,/g, '')) || 0
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
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]hue=h=${hue}:s=${saturation}:b=${lightness}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]hue=h=${hue}:s=${saturation}:b=${lightness},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]hue=h=${hue}:s=${saturation}:b=${lightness},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'hsl/hsv [hue (from -360 to 360)] [saturation (from -10 to 10)] [lightness (from -10 to 10)] <file>',
        value: "Changes the file's hue, saturation and lightness values."
    },
    cooldown: 2500,
    type: 'Color'
}