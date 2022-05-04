module.exports = {
    name: ['crewmate', 'amongus', 'amogus'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
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
            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i templates/crewmate.png -i templates/crewmatemask.png -i templates/black.png -filter_complex "[3:v][1:v]scale2ref[black][crewmate];[0:v]scale=${squareS.constraint === 'width' ? -1 : 86}:${squareS.constraint === 'height' ? -1 : 86}[frame];[black][frame]overlay=x=136.5-w/2:y=78-h/2:format=auto[tframe];[tframe][crewmate]overlay=x=0:y=0:format=auto[cout];[cout][2:v]alphamerge[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 templates/crewmate.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i templates/crewmate.png -i templates/crewmatemaskv.png -i templates/black.png -map 0:a? -filter_complex "[3:v][1:v]scale2ref[black][crewmate];[0:v]scale=${squareS.constraint === 'width' ? -1 : 86}:${squareS.constraint === 'height' ? -1 : 86}[frame];[black][frame]overlay=x=136.5-w/2:y=78-h/2:format=auto[tframe];[tframe][crewmate]overlay=x=0:y=0:format=auto[cout];[cout][2:v]overlay=x=0:y=0:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -aspect ${bwidth}:${bheight} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 templates/crewmate.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bwidth = Number(bscale[0])
            var bheight = Number(bscale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i templates/crewmate.png -i templates/crewmatemaskg.png -i templates/black.png -filter_complex "[3:v][1:v]scale2ref[black][crewmate];[0:v]scale=${squareS.constraint === 'width' ? -1 : 86}:${squareS.constraint === 'height' ? -1 : 86}[frame];[black][frame]overlay=x=136.5-w/2:y=78-h/2:format=auto[tframe];[tframe][crewmate]overlay=x=0:y=0:format=auto[cout];[cout][2:v]overlay=x=0:y=0:format=auto,colorkey=0x00AC91:0.01:0[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -aspect ${bwidth}:${bheight} -gifflags -offsetting ${filepath}/output.gif`)
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
    help: { name: 'crewmate/amongus/amogus <file>', value: 'HOP ON AMONG US!' },
    cooldown: 2500,
    type: 'Memes'
}