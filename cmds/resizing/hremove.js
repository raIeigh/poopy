module.exports = {
    name: ['hremove', 'hreversecrop'],
    args: [{ "name": "x", "required": true, "specifarg": false, "orig": "<x>" }, { "name": "w", "required": true, "specifarg": false, "orig": "<w>" }, { "name": "file", "required": false, "specifarg": false, "orig": "{file}" }],
    execute: async function (msg, args, opts) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[2] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0)
        var x = isNaN(Number(args[1])) ? undefined : Number(args[1]) <= 0 ? 0 : Number(args[1]) ?? undefined
        if (x === undefined) {
            await msg.reply('What is the X coordinate?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        var w = isNaN(Number(args[2])) ? undefined : Number(args[2]) <= 1 ? 1 : Number(args[2]) || undefined
        if (w === undefined) {
            await msg.reply('What is the width?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`

            var width = fileinfo.info.width

            if (x >= width - 1) x = width - 1
            if (w >= width - x) w = width - x

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]crop=x=0:y=0:w=${x}:h=ih[left];[0:v]crop=x=${x + w}:y=0:w=${width - (x + w)}:h=ih[right];[left][right]hstack,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)

            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`

            var width = fileinfo.info.width

            if (x >= width - 1) x = width - 1
            if (w >= width - x) w = width - x

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=0:y=0:w=${x}:h=ih[left];[0:v]crop=x=${x + w}:y=0:w=${width - (x + w)}:h=ih[right];[left][right]hstack[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)

            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`

            var width = fileinfo.info.width

            if (x >= width - 1) x = width - 1
            if (w >= width - x) w = width - x

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]crop=x=0:y=0:w=${x}:h=ih[left];[0:v]crop=x=${x + w}:y=0:w=${width - (x + w)}:h=ih[right];[left][right]hstack,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)

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
        name: '<:newpoopy:839191885310066729> hremove/hreversecrop <x> <w> {file}',
        value: 'Removes a portion of the file horizontally depending on the X axis and width.'
    },
    cooldown: 2500,
    type: 'Resizing'
}