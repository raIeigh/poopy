module.exports = {
    name: ['enlongate', 'long'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, sendFile } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let { fs } = poopy.modules

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

        if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo            })
            var filename = `input.mp4`
            var videohex = fs.readFileSync(`${filepath}/${filename}`)
            var mvhdindex = videohex.indexOf('mvhd')
            var subarray1 = videohex.subarray(0, mvhdindex + 18)
            var enlongate = Buffer.from('00017FFFFFFF', 'hex')
            var subarray2 = videohex.subarray(subarray1.length + enlongate.length, videohex.length)
            var newvideohex = Buffer.concat([subarray1, enlongate, subarray2])
            fs.writeFileSync(`${filepath}/output.mp4`, newvideohex)
            return await sendFile(msg, filepath, `output.mp4`)
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
        name: 'enlongate/long {file}',
        value: "Manipulates the video's Hex Code to make it as long as possible."
    },
    cooldown: 2500,
    type: 'Hex Manipulation'
}
