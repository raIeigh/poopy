module.exports = {
    name: ['volume'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[2] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
        var volume = isNaN(Number(args[1])) ? 100 : Number(args[1]) || 0
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
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
            var audio = fileinfo.info.audio

            if (audio) {
                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter:a "volume=${volume / 100}" -filter:v "scale=ceil(iw/2)*2:ceil(ih/2)*2" -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            } else {
                await msg.channel.send('No audio stream detected.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter:a "volume=${volume / 100}" ${filepath}/output.mp3`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp3`)
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
        name: 'volume {volume (by percentage)} <video/audio>',
        value: "Increases the file's volume by {volume}%."
    },
    cooldown: 2500,
    type: 'Audio'
}