module.exports = {
    name: ['phexoutro', 'phexoniaoutro'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video') || type.mime.startsWith('image')) {
            var filepath = await downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await execPromise(`ffmpeg -i assets/phexoutro.mp4 -filter_complex "[0:v]scale=-1:ceil(${height}/2)*2[vid];[0:v]scale=ceil(${width}/2)*2:ceil(${height}/2)*2,gblur=sigma=5:steps=6[bg];[bg][vid]overlay=x=W/2-w/2:y=H/2-h/2:format=auto[out]" -map "[out]" -preset ${findpreset(args)} -map 0:a -aspect ${width}:${height} -pix_fmt yuv420p ${filepath}/phexoutro2.mp4`)
            await execPromise(`ffmpeg -i ${filepath}/phexoutro2.mp4 -preset ${findpreset(args)} -c:v copy -bsf:v h264_mp4toannexb -f mpegts -video_track_timescale 30k -c:a aac -ac 6 -ar 44100 ${filepath}/phexoutro.ts`)
            await execPromise(`ffmpeg -i ${filepath}/${filename} -vf "scale=ceil(${width}/2)*2:ceil(${height}/2)*2" -preset ${findpreset(args)} -aspect ${width}:${height} -pix_fmt yuv420p ${filepath}/input2.mp4`)
            await execPromise(`ffmpeg -i ${filepath}/input2.mp4 -preset ${findpreset(args)} -c:v copy -bsf:v h264_mp4toannexb -f mpegts -video_track_timescale 30k -c:a aac -ac 6 -ar 44100 ${filepath}/input.ts`)
            await execPromise(`ffmpeg -i "concat:${filepath}/input.ts|${filepath}/phexoutro.ts" -c copy -preset ${findpreset(args)} -bsf:a aac_adtstoasc ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
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
        name: 'phexoutro/phexoniaoutro {file}',
        value: "Ends the file with Phexonia's outro."
    },
    cooldown: 2500,
    type: 'Inside Joke'
}