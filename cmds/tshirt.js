module.exports = {
    name: ['tshirt', 'shirt'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
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
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/tshirt.png -i assets/tshirtmask.png -i assets/white.png -filter_complex "${squareS.constraint !== 'both' ? `[0:v]crop=x=${squareS.constraint === 'height' ? 0 : 'iw/2-ih/2'}:y=${squareS.constraint === 'width' ? 0 : 'ih/2-iw/2'}:w=${squareS.constraint === 'width' ? 'ih' : 'iw'}:h=${squareS.constraint === 'height' ? 'iw' : 'ih'}[cframe];` : ''}[${squareS.constraint !== 'both' ? 'cframe' : '0:v'}][1:v]scale2ref[image][shirt];[3:v][shirt]scale2ref=w=iw*1.25:h=ih+(ow-iw)[white][tshirt];[image][2:v]overlay=x=0:y=0:format=auto[imagemask];[imagemask][tshirt]overlay=x=0:y=0:format=auto[imagetshirt];[white][imagetshirt]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/tshirt.png -i assets/tshirtmask.png -i assets/white.png -map 0:a? -filter_complex "${squareS.constraint !== 'both' ? `[0:v]crop=x=${squareS.constraint === 'height' ? 0 : 'iw/2-ih/2'}:y=${squareS.constraint === 'width' ? 0 : 'ih/2-iw/2'}:w=${squareS.constraint === 'width' ? 'ih' : 'iw'}:h=${squareS.constraint === 'height' ? 'iw' : 'ih'}[cframe];` : ''}[${squareS.constraint !== 'both' ? 'cframe' : '0:v'}][1:v]scale2ref[image][shirt];[3:v][shirt]scale2ref=w=iw*1.25:h=ih+(ow-iw)[white][tshirt];[image][2:v]overlay=x=0:y=0:format=auto[imagemask];[imagemask][tshirt]overlay=x=0:y=0:format=auto[imagetshirt];[white][imagetshirt]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/tshirt.png -i assets/tshirtmask.png -i assets/white.png -filter_complex "${squareS.constraint !== 'both' ? `[0:v]crop=x=${squareS.constraint === 'height' ? 0 : 'iw/2-ih/2'}:y=${squareS.constraint === 'width' ? 0 : 'ih/2-iw/2'}:w=${squareS.constraint === 'width' ? 'ih' : 'iw'}:h=${squareS.constraint === 'height' ? 'iw' : 'ih'}[cframe];` : ''}[${squareS.constraint !== 'both' ? 'cframe' : '0:v'}][1:v]scale2ref[image][shirt];[3:v][shirt]scale2ref=w=iw*1.25:h=ih+(ow-iw)[white][tshirt];[image][2:v]overlay=x=0:y=0:format=auto[imagemask];[imagemask][tshirt]overlay=x=0:y=0:format=auto[imagetshirt];[white][imagetshirt]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
    help: { name: 'tshirt/shirt <file>', value: 'Creates a T-Shirt the file.' },
    cooldown: 2500,
    type: 'Memes'
}