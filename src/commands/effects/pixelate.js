module.exports = {
    name: ['pixelate'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"},{"name":"size","required":false,"specifarg":true,"orig":"[-size <pixels>]"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let vars = poopy.vars

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var size = 2
        var sizeindex = args.indexOf('-size')
        if (sizeindex > -1) {
            size = isNaN(Number(args[sizeindex + 1])) ? 2 : Number(args[sizeindex + 1]) <= 1 ? 1 : Number(args[sizeindex + 1]) || 2
        }
        var currenturl = lastUrl(msg, 0)
        var fileinfo = await validateFile(currenturl, true).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo            })
            var filename = `input.png`

            await execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=iw/${size}:ih/${size}:flags=neighbor,scale=iw*${size}:ih*${size}:flags=neighbor[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo            })
            var filename = `input.mp4`

            await execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -b:a 10k -filter_complex "[0:v]scale=iw/${size}:ih/${size}:flags=neighbor,scale=iw*${size}:ih*${size}:flags=neighbor,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`, {
                fileinfo            })
            var filename = `input.gif`

            await execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=iw/${size}:ih/${size}:flags=neighbor,scale=iw*${size}:ih*${size}:flags=neighbor,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'pixelate {file} [-size <pixels>]',
        value: 'Pixelates the file.'
    },
    cooldown: 2500,
    type: 'Effects'
}