module.exports = {
    name: ['chew'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var chewings = []
        var chewnumber = Math.floor(Math.random() * 11) + 20
        for (var i = 0; i < chewnumber; i++) {
            chewings.push({
                maskpos: { x: Math.floor(Math.random() * 101) / 100, y: Math.floor(Math.random() * 101) / 100 },
                masksize: { x: Math.floor(Math.random() * 9) + 2, y: Math.floor(Math.random() * 9) + 2 },
                maskangle: Math.floor(Math.random() * 361) - 180,
                chewoffset: { x: Math.floor(Math.random() * 61) - 30, y: Math.floor(Math.random() * 61) - 30 },
                repetitions: Math.floor(Math.random() * 9) + 1,
                chew: async (frame, maskpos, masksize, maskangle, chewoffset) => {
                    var patchmask = await poopy.modules.Jimp.read(`assets/chewmask.png`)
                    var black = await poopy.modules.Jimp.read(`assets/black.png`)
                    frame2 = frame.clone()
                    patchmask.resize(frame2.bitmap.width / masksize.x, frame2.bitmap.height / masksize.y)
                    patchmask.rotate(maskangle)
                    black.resize(frame2.bitmap.width, frame2.bitmap.height)
                    black.composite(patchmask, black.bitmap.width * maskpos.x - patchmask.bitmap.width / 2, black.bitmap.height * maskpos.y - patchmask.bitmap.height / 2)
                    frame2.mask(black, 0, 0)
                    frame.composite(frame2, chewoffset.x * (frame.bitmap.width / 250), chewoffset.y * (frame.bitmap.height / 250))
                }
            })
        }
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext)) && poopy.vars.jimpFormats.find(f => f === type.ext)) {
            var currentcount = poopy.vars.filecount
            poopy.vars.filecount++
            var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            poopy.modules.fs.mkdirSync(`${filepath}`)
            var frame = await poopy.modules.Jimp.read(currenturl)
            for (var i = 0; i < chewings.length; i++) {
                var origoffset = chewings[i].chewoffset
                var offset = chewings[i].chewoffset
                for (var j = 0; j < chewings[i].repetitions; j++) {
                    await chewings[i].chew(frame, chewings[i].maskpos, chewings[i].masksize, chewings[i].maskangle, offset)
                    offset.x += (origoffset.x * (frame.bitmap.width / 250)) * chewings[i].repetitions
                    offset.y += (origoffset.y * (frame.bitmap.height / 250)) * chewings[i].repetitions
                }
            }
            await frame.writeAsync(`${filepath}/output.png`);
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
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
    help: { name: 'chew <image>', value: 'Literally chews the image.' },
    cooldown: 2500,
    type: 'Effects'
}