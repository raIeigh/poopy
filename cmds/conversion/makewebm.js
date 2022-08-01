module.exports = {
    name: ['makewebm'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined && msg.attachments.size <= 0 && !(poopy.functions.lastUrls(msg).length)) {
            await msg.channel.send('What are the frames?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };

        var fpsIsLastArg = false
        if (!isNaN(Number(args[args.length - 1])) && args[args.length - 2] !== '-frames') {
            fpsIsLastArg = true
        }
        var fps = !fpsIsLastArg ? 60 : Number(args[args.length - 1]) >= 60 ? 60 : Number(args[args.length - 1]) <= 0 ? 0 : Number(args[args.length - 1]) ?? 60

        var framenumber = 25
        var framesindex = args.indexOf('-frames')
        if (framesindex > -1) {
            framenumber = isNaN(Number(args[framesindex + 1])) ? 25 : Number(args[framesindex + 1]) <= 1 ? 1 : Number(args[framesindex + 1]) >= 50 ? 50 : Math.round(Number(args[framesindex + 1])) || 25
            args.splice(framesindex, 2)
        }
        
        var audiourl = poopy.functions.getOption(args, 'audio', { splice: true })
        var audioinfo
        if (audiourl) {
            audioinfo = await poopy.functions.validateFile(audiourl, true, {
                size: `the audio exceeds the exception size limit of {param} mb hahahaha there's nothing you can do`,
                frames: `the frames of the audio exceed the exception limit of {param} hahahaha there's nothing you can do`,
                width: `the width of the audio exceeds the exception limit of {param} hahahaha there's nothing you can do`,
                height: `the height of the audio exceeds the exception limit of {param} hahahaha there's nothing you can do`
            }).catch(async error => {
                await msg.channel.send(error).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return
            })

            if (!audioinfo) return
        }

        var lasturlserror = ''

        var frameurls = {}
        var filetypes = {}
        var infos = {}

        var fetched = await poopy.functions.getUrls(msg, { tempdir: true, string: args.join(' ') }).catch(() => { }) ?? []
        var nofiles = false
        if (fetched.length <= 0) nofiles = true

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
                    lasturlserror = `Unsupported file: \`${url}\``
                    return false
                }
                frameurls[validfilecount + 1] = url
                filetypes[validfilecount + 1] = filetype
                infos[validfilecount + 1] = fileinfo
                nofiles = false
                return true
            }

            var lastUrls = poopy.functions.lastUrls(msg, true)

            for (var i in lastUrls) {
                var url = lastUrls[i]
                var success = await inspect(url).catch(() => { })
                if (success) validfilecount += 1
                if (validfilecount >= framenumber) break
            }
            
            clearInterval(frameeditinterval)
            if (framemessage) framemessage.delete().catch(() => { })
        } else {
            for (var i in fetched) frameurls[Number(i) + 1] = fetched[i]
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
        poopy.modules.fs.mkdirSync(`${filepath}/webmframes`)

        var concatList = []

        for (var i in frameurls) {
            var frameurl = frameurls[i]

            var image = await poopy.modules.Jimp.read(frameurl)
            await image.writeAsync(`${filepath}/frames/${i.padStart(3, '0')}.png`)
            await poopy.functions.execPromise(`ffmpeg -y -i ${filepath}/frames/${i.padStart(3, '0')}.png -c:v vp8 -b:v 1M -crf 10 -auto-alt-ref 0 -vf scale=${infos[i].info.width}x${infos[i].info.height} -aspect ${infos[i].info.width}:${infos[i].info.height} -r ${fps} -f webm ${filepath}/webmframes/${i.padStart(3, '0')}.webm`)
            concatList.push(`file 'webmframes/${i.padStart(3, '0')}.webm'`)
        }

        if (audioinfo) {
            await poopy.functions.downloadFile(audiourl, `audio.mp3`, {
                fileinfo: audioinfo,
                filepath: filepath
            })
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/audio.mp3 -c:a libvorbis ${filepath}/audio.webm`)
        }

        poopy.modules.fs.writeFileSync(`${filepath}/concat.txt`, concatList.join('\n'))

        await poopy.functions.execPromise(`ffmpeg -y -f concat -safe 0 -i ${filepath}/concat.txt${audioinfo ? ` -i ${filepath}/audio.webm ` : ' '}-c copy ${filepath}/output.webm`)
        return await poopy.functions.sendFile(msg, filepath, `output.webm`)
    },
    help: {
        name: 'makewebm <frames> [-frames <framenumber (max 50)>] [-audio <audioFile>] {fps (max 60)}',
        value: 'Makes a WebM out of the frames and FPS specified.'
    },
    cooldown: 2500,
    type: 'Conversion'
}