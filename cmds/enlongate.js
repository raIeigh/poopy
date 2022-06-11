module.exports = {
    name: ['enlongate', 'long'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
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
            var videohex = poopy.modules.fs.readFileSync(`${filepath}/${filename}`)
            var mvhdindex = videohex.indexOf('mvhd')
            var subarray1 = videohex.subarray(0, mvhdindex + 18)
            var enlongate = Buffer.from('00017FFFFFFF', 'hex')
            var subarray2 = videohex.subarray(subarray1.length + enlongate.length, videohex.length)
            var newvideohex = Buffer.concat([subarray1, enlongate, subarray2])
            poopy.modules.fs.writeFileSync(`${filepath}/output.mp4`, newvideohex)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
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
        name: 'enlongate/long <video>',
        value: "Manipulates the video's Hex Code to make it as long as possible."
    },
    cooldown: 2500,
    type: 'Hex Manipulation'
}
