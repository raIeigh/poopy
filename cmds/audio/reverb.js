module.exports = {
    name: ['reverb'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[2] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0)
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
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
            var audio = fileinfo.info.audio

            if (audio) {
                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/church.mp3 -filter_complex "[0:a][1]afir=dry=10:wet=10[audio];[0:v]scale=ceil(iw/2)*2:ceil(ih/2)*2[video]" -map "[video]" -map "[audio]" -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
                return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
            } else {
                await msg.reply('No audio stream detected.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/church.mp3 -filter_complex "[0:a][1]afir=dry=10:wet=10[audio]" -map "[audio]" ${filepath}/output.mp3`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp3`)
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
        name: 'reverb {file}',
        value: 'Adds a reverb effect to the video.'
    },
    cooldown: 2500,
    type: 'Audio'
}