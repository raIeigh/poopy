module.exports = {
    name: ['dividelength', 'divideduration'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var speed = isNaN(Number(args[1])) ? 2 : Number(args[1]) <= 1 ? 1 : Number(args[1]) >= 6 ? 6 : Number(args[1]) || 2
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
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
            var subarray1 = videohex.subarray(0, mvhdindex + 20)
            var doublehex = (Number('0x' + videohex.toString('hex').substring((mvhdindex + 20) / speed, (mvhdindex + 24) / speed)) / speed).toString(16).padStart(8, '0')
            var doublelength = Buffer.from(doublehex.substring(doublehex.length - 8, doublehex.length), 'hex')
            var subarray2 = videohex.subarray(subarray1.length + doublelength.length, videohex.length)
            var newvideohex = Buffer.concat([subarray1, doublelength, subarray2])
            poopy.modules.fs.writeFileSync(`${filepath}/output.mp4`, newvideohex)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'dividelength/divideduration [multiplier (from 1 to 6)] <video>',
        value: "Manipulates the video's Hex Code to divide its duration."
    },
    cooldown: 2500,
    type: 'Hex Manipulation'
}
