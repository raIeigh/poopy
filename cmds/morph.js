module.exports = {
    name: ['morph', 'transform'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] === undefined && args[2] === undefined) {
            msg.channel.send('What are the files?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var currenturl2 = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] || args[2]
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
        }).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo) return
        var filetype = fileinfo.type
        var fileinfo2 = await poopy.functions.validateFile(currenturl2, false, {
            size: `the second file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the second file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo2) return
        var filetype2 = fileinfo2.type
        var filetypes = [filetype, filetype2]
        for (var i in errors) {
            var error = errors[i]
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
        }
        for (var i in filetypes) {
            var type = filetypes[i]
            if (!(type.mime.startsWith('image') || type.mime.startsWith('video'))) {
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
        var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
            fileinfo: fileinfo
        })
        var filename = `input.${fileinfo.shortext}`
        await poopy.functions.downloadFile(currenturl2, `input2.${fileinfo2.shortext}`, {
            fileinfo: fileinfo2,
            filepath: filepath
        })
        var filename2 = `input2.${fileinfo2.shortext}`

        poopy.modules.fs.mkdirSync(`${filepath}/frames`)

        await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vf "scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease" -vframes 1 ${filepath}/static.png`)
        await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename2} -vf "scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease" -vframes 1 ${filepath}/static2.png`)
        await poopy.functions.execPromise(`python templates/morph.py ${filepath}`)
        await poopy.functions.execPromise(`ffmpeg -i ${filepath}/frames/frame_%06d.png -filter_complex "[0:v]scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.gif`)
        await poopy.functions.sendFile(msg, filepath, `output.gif`)
    },
    help: {
        name: 'morph/transform <file> <file2>',
        value: 'Morphs the first file into the second.'
    },
    cooldown: 2500,
    type: 'Animation'
}