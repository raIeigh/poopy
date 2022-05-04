module.exports = {
    name: ['battlecats', 'bc'],
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
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 templates/battlecats.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bheight = Number(bscale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=${height > (bheight / 1.1) ? -1 : 'iw'}:${height > (bheight / 1.1) ? bheight / 1.3 : 'ih'}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/scaled.png`)
            var scale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/scaled.png`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            height = Number(scale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/scaled.png -i templates/battlecats.png -i templates/shadow.png -filter_complex "[2:v]scale=${width + 15}:10[shadow];[1:v][shadow]overlay=x=W/2-w/2:y=H/1.1-h/2:format=auto[bshadow];[bshadow][0:v]overlay=x=W/2-w/2:y=H/1.1-h:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 templates/battlecats.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bheight = Number(bscale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]scale=${height > (bheight / 1.1) ? -1 : 'iw'}:${height > (bheight / 1.1) ? bheight / 1.3 : 'ih'}[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/scaled.mp4`)
            var scale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/scaled.mp4`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            height = Number(scale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/scaled.mp4 -i templates/battlecats.png -i templates/shadow.png -map 0:a? -filter_complex "[2:v]scale=${width + 15}:10[shadow];[1:v][shadow]overlay=x=W/2-w/2:y=H/1.1-h/2:format=auto[bshadow];[bshadow][0:v]overlay=x=W/2-w/2:y=H/1.1-h:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var bscale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 templates/battlecats.png`)
            bscale = bscale.replace(/\n|\r/g, '').split('x')
            var bheight = Number(bscale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=${height > (bheight / 1.1) ? -1 : 'iw'}:${height > (bheight / 1.1) ? bheight / 1.3 : 'ih'}[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/scaled.gif`)
            var scale = await poopy.functions.execPromise(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filepath}/scaled.gif`)
            scale = scale.replace(/\n|\r/g, '').split('x')
            height = Number(scale[1])

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/scaled.gif -i templates/battlecats.png -i templates/shadow.png -filter_complex "[2:v]scale=${width + 15}:10[shadow];[1:v][shadow]overlay=x=W/2-w/2:y=H/1.1-h/2:format=auto[bshadow];[bshadow][0:v]overlay=x=W/2-w/2:y=H/1.1-h:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'battlecats/bc <file>',
        value: 'Command your Cats with simple controls in a battle through space and time! No need to register to develop your own Cat Army! BATTLE WITH ALL THE CATS!!'
    },
    cooldown: 2500,
    type: 'Memes'
}