module.exports = {
    name: ['vmerge'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 1) === undefined && args[2] === undefined) {
            await msg.channel.send('What are the files?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0) || args[1]
        var currenturl2 = poopy.functions.lastUrl(msg, 1) || args[2]
        var urls = await poopy.functions.getUrls(msg).catch(() => { }) ?? []
        if (urls.length < 2) {
            var c = currenturl
            currenturl = currenturl2
            currenturl2 = c
        }
        var errors = {}
        var fileinfo = await poopy.functions.validateFile(currenturl, false, {
            size: `the first file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the first file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the first file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the first file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo) return
        var filetype = fileinfo.type
        var fileinfo2 = await poopy.functions.validateFile(currenturl2, false, {
            size: `the second file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the second file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo2) return
        var filetype2 = fileinfo2.type
        var filetypes = [filetype, filetype2]
        for (var i in errors) {
            var error = errors[i]
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
        }
        for (var i in filetypes) {
            var type = filetypes[i]
            if (!(type.mime.startsWith('image') || type.mime.startsWith('video'))) {
                await msg.channel.send({
                    content: 'Unsupported file types.',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return
            }
        }
        var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
            fileinfo: fileinfo
        })
        var filename = `input.${fileinfo.shortext}`
        await poopy.functions.downloadFile(currenturl2, `input2.${fileinfo2.shortext}`, {
            fileinfo: fileinfo2,
            filepath: filepath
        })
        var filename2 = `input2.${fileinfo2.shortext}`

        var fps = fileinfo.info.fps
        var fps2 = fileinfo2.info.fps
        var width = (args.find(arg => arg === '-swapwidth') ? fileinfo2 : fileinfo).info.width

        if ((filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext))) && (filetype2.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype2.ext)))) {
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/${filename2} -filter_complex "[0:v]scale=${width}:-1[file];[1:v]scale=${width}:-1[file2];[file][file2]vstack=shortest=1[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if ((filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext))) && ((filetype2.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === filetype2.ext)))) {
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -r ${fps2} -i ${filepath}/${filename} -r ${fps2} -i ${filepath}/${filename2} -filter_complex "[0:v]scale=${width}:-1[file];[1:v]scale=${width}:-1[file2];[file][file2]vstack=shortest=1[qout];[qout]scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease[rout];[rout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if ((filetype.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === filetype.ext)) && (filetype2.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype2.ext)))) {
            await poopy.functions.execPromise(`ffmpeg -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -stream_loop -1 -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename2} -filter_complex "[0:v]scale=${width}:-1[file];[1:v]scale=${width}:-1[file2];[file][file2]vstack=shortest=1[sout];[sout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if (filetype.mime.startsWith('video') || filetype2.mime.startsWith('video')) {
            await poopy.functions.execPromise(`ffmpeg ${(filetype2.mime.startsWith('video') && !(filetype.mime.startsWith('video'))) ? '-stream_loop -1 ' : ''}-r ${fps.includes('0/0') ? '60' : fps} -i ${filepath}/${filename} ${(filetype.mime.startsWith('video') && !(filetype2.mime.startsWith('video'))) ? '-stream_loop -1 ' : ''}-r ${fps.includes('0/0') ? '60' : fps} -i ${filepath}/${filename2} -map ${filetype.mime.startsWith('video') ? '0' : '1'}:a? -filter_complex "[0:v]scale=${width}:-1[file];[1:v]scale=${width}:-1[file2];[file][file2]vstack=shortest=1[sout];[sout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else {
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename} -r ${fps.includes('0/0') ? '50' : fps} -i ${filepath}/${filename2} -filter_complex "[0:v]scale=${width}:-1[file];[1:v]scale=${width}:-1[file2];[file][file2]vstack=shortest=1[rout];[rout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        }
    },
    help: {
        name: 'vmerge <file> <file2> [-swapwidth]',
        value: 'Merges the first file with the second one vertically.'
    },
    cooldown: 2500,
    type: 'Overlaying'
}