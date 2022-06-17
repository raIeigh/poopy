module.exports = {
    name: ['notclickbait', 'redcircle'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var saidMessage = args.slice(1).join(' ')
        var random = false
        if (saidMessage.includes('-random')) random = true
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

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/redcircle.png -filter_complex "[1:v]scale=${random ? `${(width + height) / 5}:-1` : `${squareS.constraint === 'width' ? -1 : width}:${squareS.constraint === 'height' ? -1 : height}`}[circle];[0:v][circle]overlay=x=${random ? (Math.floor(Math.random() * (width + 1)) - 1) + '-w/2' : 'W/2-w/2'}:y=${random ? (Math.floor(Math.random() * (height + 1)) - 1) + '-h/2' : 'H/2-h/2'}:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/redcircle.png -map 0:a? -filter_complex "[1:v]scale=${random ? `${(width + height) / 5}:-1` : `${squareS.constraint === 'width' ? -1 : width}:${squareS.constraint === 'height' ? -1 : height}`}[circle];[0:v][circle]overlay=x=${random ? (Math.floor(Math.random() * (width + 1)) - 1) + '-w/2' : 'W/2-w/2'}:y=${random ? (Math.floor(Math.random() * (height + 1)) - 1) + '-h/2' : 'H/2-h/2'}:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var squareS = { value: ((height === width) && width) || ((height > width) && height) || width, constraint: ((height === width) && 'both') || ((height > width) && 'height') || 'width' }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/redcircle.png -filter_complex "[1:v]scale=${random ? `${(width + height) / 5}:-1` : `${squareS.constraint === 'width' ? -1 : width}:${squareS.constraint === 'height' ? -1 : height}`}[circle];[0:v][circle]overlay=x=${random ? (Math.floor(Math.random() * (width + 1)) - 1) + '-w/2' : 'W/2-w/2'}:y=${random ? (Math.floor(Math.random() * (height + 1)) - 1) + '-h/2' : 'H/2-h/2'}:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'notclickbait/redcircle [-random] <file>',
        value: 'Real.\n' +
            'Example usage: p:notclickbait -random https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F9%2F2013%2F12%2F06%2F201307-xl-spice-roasted-pork-tenderloin-2000.jpg'
    },
    cooldown: 2500,
    type: 'Memes'
}