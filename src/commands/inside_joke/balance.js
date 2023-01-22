module.exports = {
    name: ['balance'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('Was ist the file bruh').catch(() => { })
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
                fileinfo            })
            var filename = `input.${fileinfo.shortext}`

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            await execPromise(`ffmpeg -i ${filepath} -i assets/audio/balance.mp3 -c:v copy -map 0:v:0 -map 1:a:0 balancing.mp4`)
            return await sendFile(msg, filepath, `balancing.mp4`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'balance {file}',
        value: "Replaces the audio with balance ost."
    },
    cooldown: 3000,
    type: 'Inside Joke'
}
