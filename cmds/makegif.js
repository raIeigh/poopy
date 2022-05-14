module.exports = {
    name: ['makegif'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined && msg.attachments.size <= 0 && !(poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'].length)) {
            await msg.channel.send('What are the frames?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };

        var fpsIsLastArg = false
        if (!isNaN(Number(args[args.length - 1])) && args[args.length - 2] !== '-frames') {
            fpsIsLastArg = true
        }
        var fps = !fpsIsLastArg ? 50 : Number(args[args.length - 1]) >= 50 ? 50 : Number(args[args.length - 1]) <= 0 ? 0 : Number(args[args.length - 1]) ?? 50

        var framenumber = 50
        var framesindex = args.indexOf('-frames')
        if (framesindex > -1) {
            framenumber = isNaN(Number(args[framesindex + 1])) ? 50 : Number(args[framesindex + 1]) <= 1 ? 1 : Number(args[framesindex + 1]) >= 100 ? 100 : Math.round(Number(args[framesindex + 1])) || 50
            args.splice(framesindex, 2)
        }

        var saidMessage = args.slice(1, fpsIsLastArg ? args.length - 1 : args.length).join(' ')

        var lasturlserror = ''

        var frameurls = {}
        var filetypes = {}
        var infos = {}

        var nofiles = false
        if (msg.attachments.size <= 0 && !(args.find(arg => poopy.vars.validUrl.test(arg)))) nofiles = true

        if (nofiles) {
            var validfilecount = 0
            var framemessage = await msg.channel.send(`Found 0 images.`).catch(() => { })

            var frameeditinterval = setInterval(() => {
                if (framemessage) framemessage.edit(`Found ${validfilecount} images.`).catch(() => { })
            }, 5000)

            async function inspect(url) {
                var lasturlerror
                var fileinfo = await poopy.functions.validateFile(url, false, {
                    size: `one of the files exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
                    frames: `the frames of one of the files exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
                    width: `the width of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`,
                    height: `the height of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`
                }).catch(error => {
                    lasturlerror = error
                    lasturlserror = error
                })
                if (lasturlerror || !fileinfo) return false
                var filetype = fileinfo.type
                if (!filetype || !(filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext)) && poopy.vars.jimpFormats.find(f => f === filetype.ext))) {
                    lasturlerror = error
                    lasturlserror = `Unsupported file: ${url}`
                    return false
                }
                frameurls[validfilecount + 1] = url
                filetypes[validfilecount + 1] = filetype
                infos[validfilecount + 1] = fileinfo
                nofiles = false
                return true
            }

            for (var i in poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls']) {
                var url = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'][i]
                var success = await inspect(url).catch(() => { })
                if (success) validfilecount += 1
                if (validfilecount >= framenumber) break
            }
            
            clearInterval(frameeditinterval)
            if (framemessage) framemessage.delete().catch(() => { })
        } else if (msg.attachments.size) {
            var attachments = msg.attachments.map(attachment => attachment.url)
            for (var i in attachments) frameurls[Number(i) + 1] = attachments[i]
        } else {
            var split = saidMessage.split(' ')
            for (var i in split) frameurls[Number(i) + 1] = split[i]
        }

        if (nofiles && lasturlserror) {
            await msg.channel.send({
                content: lasturlserror,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }

        for (var i in frameurls) {
            if (!filetypes[i] || !infos[i]) {
                var error
                var imageurl = frameurls[i]
                var fileinfo = await poopy.functions.validateFile(imageurl, false, {
                    size: `one of the files exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
                    frames: `the frames of one of the files exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
                    width: `the width of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`,
                    height: `the height of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`
                }).catch(err => {
                    error = err
                })
                if (error) {
                    await msg.channel.send({
                        content: error,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                }
                var filetype = fileinfo.type
                if (!(filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext)) && poopy.vars.jimpFormats.find(f => f === filetype.ext))) error = `Unsupported file: \`${imageurl}\``
                if (error) {
                    await msg.channel.send({
                        content: error,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                }
                filetypes[i] = filetype
                infos[i] = fileinfo
            }
        }

        var currentcount = poopy.vars.filecount
        poopy.vars.filecount++
        var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`

        poopy.modules.fs.mkdirSync(`${filepath}`)
        poopy.modules.fs.mkdirSync(`${filepath}/frames`)
        var framesizes
        for (var i in frameurls) {
            var frameurl = frameurls[i]
            if (!framesizes) {
                framesizes = { x: infos[i].info.width, y: infos[i].info.height }
            }

            var image = await poopy.modules.Jimp.read(frameurl)
            image.resize(framesizes.x, framesizes.y)
            await image.writeAsync(`${filepath}/frames/${i}.png`)
        }

        await poopy.functions.execPromise(`ffmpeg -r ${fps} -i ${filepath}/frames/%d.png -filter_complex "[0:v]scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[gif][pgif];[pgif]palettegen=reserve_transparent=1[palette];[gif][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -vsync 0 -gifflags -offsetting ${filepath}/output.gif`)
        await poopy.functions.sendFile(msg, filepath, `output.gif`)
    },
    help: {
        name: 'makegif <frames> [-frames <framenumber (max 100)> {fps (max 50)}',
        value: 'Makes a GIF out of the frames and FPS specified.'
    },
    cooldown: 2500,
    type: 'Conversion'
}