module.exports = {
    name: ['emotegame', 'emote'],
    args: [{"name":"file","required":false,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
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

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/emote.png -filter_complex "[1:v]scale=${width}/2.5:-1,rotate=-5*PI/180:ow=rotw(-5*PI/180):oh=roth(-5*PI/180):c=0x00000000[emote];[0:v][emote]overlay=x=w/20:y=h/20:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/emote.png -map 0:a? -filter_complex "[1:v]scale=${width}/2.5:-1,rotate=-5*PI/180:ow=rotw(-5*PI/180):oh=roth(-5*PI/180):c=0x00000000[emote];[0:v][emote]overlay=x=w/20:y=h/20:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/emote.png -filter_complex "[1:v]scale=${width}/2.5:-1,rotate=-5*PI/180:ow=rotw(-5*PI/180):oh=roth(-5*PI/180):c=0x00000000[emote];[0:v][emote]overlay=x=w/20:y=h/20:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
        name: 'emotegame/emote {file}',
        value: 'Applies the Emote Game Logo to the file.'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}