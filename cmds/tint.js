module.exports = {
    name: ['tint'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[4] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
        var r = (isNaN(Number(String(args[1]).replace(/,/g, ''))) ? 0 : Number(String(args[1]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[1]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[1]).replace(/,/g, '')) || 0).toString(16).padStart(2, '0')
        var g = (isNaN(Number(String(args[2]).replace(/,/g, ''))) ? 0 : Number(String(args[2]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[2]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[2]).replace(/,/g, '')) || 0).toString(16).padStart(2, '0')
        var b = (isNaN(Number(String(args[3]).replace(/,/g, ''))) ? 0 : Number(String(args[3]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[3]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[3]).replace(/,/g, '')) || 0).toString(16).padStart(2, '0')
        var a = isNaN(Number(String(args[4]).replace(/,/g, ''))) ? 179 : Number(String(args[4]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[4]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[4]).replace(/,/g, '')) ?? 179
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -f lavfi -i "color=0x${r}${g}${b}:s=${width}x${height},format=rgba" -filter_complex "[0:v][1:v]blend=shortest=1:all_mode=overlay:all_opacity=${a / 255}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -f lavfi -i "color=0x${r}${g}${b}:s=${width}x${height},format=rgba" -map 0:a? -filter_complex "[0:v][1:v]blend=shortest=1:all_mode=overlay:all_opacity=${a / 255},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -f lavfi -i "color=0x${r}${g}${b}:s=${width}x${height},format=rgba" -filter_complex "[0:v][1:v]blend=shortest=1:all_mode=overlay:all_opacity=${a / 255},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: 'tint [r] [g] [b] [a] <file>',
        value: 'Tints the file with the new color depending on the RGBA values.'
    },
    cooldown: 2500,
    type: 'Color'
}