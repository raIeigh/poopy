module.exports = {
    name: ['8bit', 'reducecolors'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"},{"name":"colors","required":false,"specifarg":true,"orig":"[-colors <number (from 1 to 255)>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var colors = 30
        var colorsindex = args.indexOf('-colors')
        if (colorsindex > -1) {
            colors = isNaN(Number(args[colorsindex + 1])) ? 30 : Number(args[colorsindex + 1]) <= 1 ? 1 : Number(args[colorsindex + 1]) >= 255 ? 255 : Math.round(Number(args[colorsindex + 1])) ?? 30
        }
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
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
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=max_colors=${colors}:reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/billboard.png -map 0:a? -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=max_colors=${colors}[palette];[pout][palette]paletteuse=alpha_threshold=128,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/billboard.png -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=max_colors=${colors}:reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: '8bit/reducecolors {file} [-colors <number (from 1 to 255)>]',
        value: 'Reduces the color range within the file, being able to produce some 8-bit-ish effect when low.'
    },
    cooldown: 2500,
    type: 'Compression'
}