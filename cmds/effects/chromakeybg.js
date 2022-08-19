module.exports = {
    name: ['chromakeybg', 'chromabg'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"},{"name":"color","required":false,"specifarg":true,"orig":"[-color <r> <g> <b>]"},{"name":"similarity","required":false,"specifarg":true,"orig":"[-similarity <number (from 0 to 100)>]"},{"name":"blend","required":false,"specifarg":true,"orig":"[-blend <number (from 0 to 100)>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var rgb = {
            r: 0,
            g: 255,
            b: 0,
        }
        var colorindex = args.indexOf('-color')
        if (colorindex > -1) {
            var r = args[colorindex + 1]
            var g = args[colorindex + 2]
            var b = args[colorindex + 3]
            rgb.r = isNaN(Number(String(r).replace(/,/g, ''))) ? 0 : Number(String(r).replace(/,/g, '')) <= 0 ? 0 : Number(String(r).replace(/,/g, '')) >= 255 ? 255 : Number(String(r).replace(/,/g, '')) || 0
            rgb.g = isNaN(Number(String(g).replace(/,/g, ''))) ? 0 : Number(String(g).replace(/,/g, '')) <= 0 ? 0 : Number(String(g).replace(/,/g, '')) >= 255 ? 255 : Number(String(g).replace(/,/g, '')) || 0
            rgb.b = isNaN(Number(String(b).replace(/,/g, ''))) ? 0 : Number(String(b).replace(/,/g, '')) <= 0 ? 0 : Number(String(b).replace(/,/g, '')) >= 255 ? 255 : Number(String(b).replace(/,/g, '')) || 0
        }
        var rgbhex = `0x${rgb.r.toString(16).padStart(2, '0').toUpperCase()}${rgb.g.toString(16).padStart(2, '0').toUpperCase()}${rgb.b.toString(16).padStart(2, '0').toUpperCase()}`
        var similarity = 30
        var similarityindex = args.indexOf('-similarity')
        if (similarityindex > -1) {
            similarity = isNaN(Number(args[similarityindex + 1])) ? 30 : Number(args[similarityindex + 1]) <= 0 ? 0 : Number(args[similarityindex + 1]) >= 100 ? 100 : Number(args[similarityindex + 1]) ?? 30
        }
        var blend = 30
        var blendindex = args.indexOf('-blend')
        if (blendindex > -1) {
            blend = isNaN(Number(args[blendindex + 1])) ? 30 : Number(args[blendindex + 1]) <= 0 ? 0 : Number(args[blendindex + 1]) >= 100 ? 100 : Number(args[blendindex + 1]) ?? 30
        }
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
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
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/billboard.png -map 0:a? -filter_complex "[0:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100}[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/billboard.png -filter_complex "[0:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100}[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'chromakeybg/chromabg {file} [-color <r> <g> <b>] [-similarity <number (from 0 to 100)>] [-blend <number (from 0 to 100)>]',
        value: "Tries to remove the file's background with chroma key."
    },
    cooldown: 2500,
    type: 'Effects'
}