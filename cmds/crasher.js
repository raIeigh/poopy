module.exports = {
    name: ['crasher', 'crashvideo'],
    execute: async function (msg, args) {
        let poopy = this

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
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

            if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
                var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                    fileinfo: fileinfo
                })
                var filename = `input.${fileinfo.shortext}`
                poopy.modules.fs.copyFileSync(`assets/crash.webm`, `${filepath}/crash.webm`)

                await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -pix_fmt yuv444p -preset ${poopy.functions.findpreset(args)} ${filepath}/webm.webm`)
                poopy.modules.fs.writeFileSync(`${filepath}/concat.txt`, `file 'webm.webm'\nfile 'crash.webm'`)
                await poopy.functions.execPromise(`ffmpeg -f concat -i ${filepath}/concat.txt -codec copy -preset ${poopy.functions.findpreset(args)} ${filepath}/output.webm`)
                await poopy.functions.sendFile(msg, filepath, `output.webm`)
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
        } else {
            await msg.channel.send('You need to be an administrator to execute that! (you can do it in another server though I won\'t stop you)').catch(() => { })
            return;
        }
    },
    help: {
        name: 'crasher/crashvideo <file> (admin only)',
        value: "Manipulates the file to make it a WebM crasher."
    },
    cooldown: 2500,
    perms: ['ADMINISTRATOR'],
    type: 'Hex Manipulation'
}
