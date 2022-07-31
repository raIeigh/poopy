module.exports = {
    name: ['wackyscale', 'wackyresize'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]

        var modes = [
            'bounce',
            'shutter',
            'sporadic',
            'bounce+shutter'
        ]

        var mode = poopy.functions.getOption(args, 'mode', { dft: 'bounce', func: (mode) => poopy.functions.parseString(mode, modes, { lower: true }) })
        if (!mode) {
            await msg.channel.send('Not a supported mode.').catch(() => { })
            return
        }

        var delta = poopy.functions.getOption(args, 'delta', { dft: 2, func: (delta) => poopy.functions.parseNumber(delta, { dft: 2, min: 0.01, max: 100 }) })
        var bps = poopy.functions.getOption(args, 'bps', { dft: 1.9, func: (bps) => poopy.functions.parseNumber(bps, { dft: 1.9, min: 0.01, max: 100 }) })

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

            await poopy.functions.wackywebm.call(poopy, mode, `${filepath}/${filename}`, {
                delta: delta,
                bouncesPerSecond: bps
            })

            return await poopy.functions.sendFile(msg, filepath, `output.webm`)
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
        name: 'wackyscale <video> [-mode <value (bounce, shutter, sporadic, bounce+shutter)>] [-delta <number (default 2)>] [-bps <number (default 1.9)>]',
        value: "Manipulates the video to make it a WebM that scales itself during playtime."
    },
    cooldown: 2500,
    type: 'Resizing'
}
