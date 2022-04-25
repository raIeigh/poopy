module.exports = {
    name: ['makegif'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined && msg.attachments.size <= 0 && !(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'].length)) {
            msg.channel.send('What are the frames?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var frameurls = []
        var fpsIsLastArg = false
        if (!isNaN(Number(args[args.length - 1])) && args[args.length - 2] !== '-frames') {
            fpsIsLastArg = true
        }
        var framenumber = 50
        var framesindex = args.indexOf('-frames')
        if (framesindex > -1) {
            framenumber = isNaN(Number(args[framesindex + 1])) ? 50 : Number(args[framesindex + 1]) <= 1 ? 1 : Number(args[framesindex + 1]) >= 100 ? 100 : Math.round(Number(args[framesindex + 1])) || 50
            args.splice(framesindex, 2)
        }
        var nofiles = false
        if (msg.attachments.size <= 0 && !(args.find(arg => poopy.vars.validUrl.test(arg)))) nofiles = true
        var fps = !fpsIsLastArg ? undefined : Number(args[args.length - 1]) >= 60 ? 60 : Number(args[args.length - 1]) <= 0 ? 0 : Number(args[args.length - 1]) || undefined
        var saidMessage = args.splice(1, fpsIsLastArg ? args.length - 2 : args.length - 1).join(' ')
        var lasturlserror = ''
        if (nofiles) {
            var validfilecount = 0

            async function inspect(url) {
                var lasturlerror = false
                var fileinfo = await poopy.functions.validateFile(url, false, {
                    size: `one of the files exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
                    frames: `the frames of one of the files exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
                    width: `the width of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`,
                    height: `the height of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`
                }).catch(error => {
                    lasturlerror = error
                })
                if (lasturlerror) return
                var filetype = fileinfo.type
                if (lasturlerror) return
                if (!(filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext)))) return
                frameurls.push(url)
                return true
            }

            for (var i in poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls']) {
                var url = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'][i]
                var success = await inspect(url).catch(() => { })
                if (success) validfilecount += 1
                if (validfilecount >= framenumber) break
            }
        } else if (msg.attachments.size) {
            msg.attachments.forEach(attachment => {
                frameurls.push(attachment.url)
            })
        } else {
            frameurls = saidMessage.split(' ')
        }
        var filetypes = []
        var infos = []
        var error = ''

        for (var i in frameurls) {
            var url = frameurls[i]
            if (error) break
            var fileinfo = await poopy.functions.validateFile(url, false, {
                size: `one of the files exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
                frames: `the frames of one of the files exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
                width: `the width of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`,
                height: `the height of one of the files exceeds the limit of {param} hahahaha (try to use the shrink command)`
            }).catch(err => {
                error = err
            })
            if (error) break
            var filetype = fileinfo.type
            if (!(filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext)))) error = `Unsupported file: \`${url}\``
            if (error) break
            filetypes.push(filetype)
            infos.push(fileinfo.info)
        }

        if (nofiles && lasturlserror && !frameurls.length) {
            msg.channel.send({
                content: lasturlserror,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }

        if (error) {
            msg.channel.send({
                content: error,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }

        for (var i in filetypes) {
            var type = filetypes[i]
            if (!(type.mime.startsWith('image') || poopy.vars.gifFormats.find(f => f === type.ext))) {
                msg.channel.send({
                    content: 'Unsupported file types.',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                msg.channel.sendTyping().catch(() => { })
                return
            }
        }

        var currentcount = poopy.vars.filecount
        poopy.vars.filecount++
        var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`

        poopy.modules.fs.mkdirSync(`${filepath}`)
        poopy.modules.fs.mkdirSync(`${filepath}/frames`)
        var framesizes
        for (var i = 0; i < frameurls.length; i++) {
            var frameurl = frameurls[i]
            if (!framesizes) {
                framesizes = { x: infos[i].width, y: infos[i].height }
            }
            await poopy.functions.downloadFile(frameurl, `${i}.png`, {
                filepath: `${filepath}/frames`,
                ffmpeg: true,
                ffmpegstring: `-filter_complex "[0:v]scale=${framesizes.x}:${framesizes.y},scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease[out]" -map [out]`
            })
        }
        await poopy.functions.execPromise(`ffmpeg ${fps && `-r ${fps}` || ''} -i ${filepath}/frames/%d.png -filter_complex "[0:v]split[gif][pgif];[pgif]palettegen=reserve_transparent=1[palette];[gif][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -vsync 0 -gifflags -offsetting ${filepath}/output.gif`)
        await poopy.functions.sendFile(msg, filepath, `output.gif`)
    },
    help: {
        name: 'makegif <frames> [-frames <framenumber (max 100)> {fps}',
        value: 'Makes a GIF out of the frames and FPS specified.'
    },
    cooldown: 2500,
    type: 'Conversion'
}