module.exports = {
    name: ['allaboutme', 'mynameis'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var overlays = [
            [82, 55, 68, 17],
            [205, 56, 33, 17],
            [87, 78, 65, 14],
            [203, 78, 15, 12],
            [264, 78, 14, 12],
            [213, 120, 95, 13],
            [14, 114, 150, 146],
            [181, 169, 154, 95],
            [48, 296, 54, 12],
            [183, 370, 56, 56],
            [18, 353, 137, 81],
            [251, 289, 86, 68]
        ]
        var i = 1
        var osplit = overlays.map(() => `[in${i++}]`)
        i = 1
        var oover = overlays.map(xywh => `[in${i}]scale=${xywh[2]}:${xywh[3]}[ou${i}];[${i !== 1 ? `white${i - 1}` : 'w'}][ou${i}]overlay=x=${xywh[0]}:y=${xywh[1]}:format=auto[${i === overlays.length ? `whitest` : `white${i++}`}]`)
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

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i templates/allaboutme.png -i templates/white.png -filter_complex "[2:v][1:v]scale2ref[w][allabout];[0:v]split=${overlays.length}${osplit.join('')};${oover.join(';')};[whitest][allabout]overlay=x=0:y=0:format=auto[out]" -map "[out]" -vframes 1 -aspect 350:453 -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var duration = fileinfo.info.duration

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i templates/allaboutme.png -i templates/white.png -map 0:a? -filter_complex "[2:v][1:v]scale2ref[w][allabout];[0:v]split=${overlays.length}${osplit.join('')};${oover.join(';')};[whitest][allabout]overlay=x=0:y=0:format=auto,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -t ${duration} -aspect 350:453  -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var duration = fileinfo.info.duration

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i templates/allaboutme.png -i templates/white.png -filter_complex "[2:v][1:v]scale2ref[w][allabout];[0:v]split=${overlays.length}${osplit.join('')};${oover.join(';')};[whitest][allabout]overlay=x=0:y=0:format=auto,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -t ${duration} -aspect 350:453 -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
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
    help: {
        name: 'allaboutme/mynameis <file>',
        value: 'there is no jojo reference'
    },
    cooldown: 2500,
    type: 'Memes'
}