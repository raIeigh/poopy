module.exports = {
    name: ['chromakey', 'chroma'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 1) === undefined && args[2] === undefined) {
            await msg.channel.send('What are the files?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var rgb = {
            r: 0,
            g: 255,
            b: 0,
        }
        var colorindex = args.indexOf('-color')
        if (colorindex > -1) {
            var r = args[colorindex + 1]
            var g = args[colorindex + 2]
            var b = args[colorindex + 3]
            rgb.r = isNaN(Number(String(r).replace(/,/g, ''))) ? 0 : Number(String(r).replace(/,/g, '')) <= 0 ? 0 : Number(String(r).replace(/,/g, '')) >= 255 ? 255 : Number(String(r).replace(/,/g, '')) || 0
            rgb.g = isNaN(Number(String(g).replace(/,/g, ''))) ? 0 : Number(String(g).replace(/,/g, '')) <= 0 ? 0 : Number(String(g).replace(/,/g, '')) >= 255 ? 255 : Number(String(g).replace(/,/g, '')) || 0
            rgb.b = isNaN(Number(String(b).replace(/,/g, ''))) ? 0 : Number(String(b).replace(/,/g, '')) <= 0 ? 0 : Number(String(b).replace(/,/g, '')) >= 255 ? 255 : Number(String(b).replace(/,/g, '')) || 0
        }
        var rgbhex = `0x${rgb.r.toString(16).padStart(2, '0').toUpperCase()}${rgb.g.toString(16).padStart(2, '0').toUpperCase()}${rgb.b.toString(16).padStart(2, '0').toUpperCase()}`
        var similarity = 30
        var similarityindex = args.indexOf('-similarity')
        if (similarityindex > -1) {
            similarity = isNaN(Number(args[similarityindex + 1])) ? 30 : Number(args[similarityindex + 1]) <= 0 ? 0 : Number(args[similarityindex + 1]) >= 100 ? 100 : Number(args[similarityindex + 1]) ?? 30
        }
        var blend = 30
        var blendindex = args.indexOf('-blend')
        if (blendindex > -1) {
            blend = isNaN(Number(args[blendindex + 1])) ? 30 : Number(args[blendindex + 1]) <= 0 ? 0 : Number(args[blendindex + 1]) >= 100 ? 100 : Number(args[blendindex + 1]) ?? 30
        }
        var keepaspectratio
        var origins = {
            x: {
                left: '0',
                center: '(W-w)/2',
                right: '(W-w)'
            },

            y: {
                top: '0',
                middle: '(H-h)/2',
                bottom: '(H-h)'
            },
        }
        var originx = '(W-w)/2'
        var originy = '(H-h)/2'
        var originindex = args.indexOf('-origin')
        if (originindex > -1) {
            originx = origins.x[args[originindex + 1]] || '(W-w)/2'
            originy = origins.y[args[originindex + 2]] || '(H-h)/2'
        }
        var ratioindex = args.indexOf('-keepaspectratio')
        if (ratioindex > -1) {
            if (args[ratioindex + 1] == 'increase' || args[ratioindex + 1] == 'decrease') {
                keepaspectratio = args[ratioindex + 1]
            }
        }
        var ox = 0
        var oy = 0
        var offsetindex = args.indexOf('-offsetpos')
        if (offsetindex > -1) {
            ox = isNaN(Number(String(args[offsetindex + 1]).replace(/,/g, ''))) ? 0 : Number(String(args[offsetindex + 1]).replace(/,/g, '')) || 0
            oy = isNaN(Number(String(args[offsetindex + 2]).replace(/,/g, ''))) ? 0 : Number(String(args[offsetindex + 2]).replace(/,/g, '')) || 0
        }
        var size = 0
        var sizeindex = args.indexOf('-size')
        if (sizeindex > -1) {
            size = isNaN(Number(args[sizeindex + 1])) ? 0 : Number(args[sizeindex + 1]) <= 1 ? 1 : Number(args[sizeindex + 1]) || 0
        }
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) || args[1]
        var currenturl2 = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 1) || args[2]
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
            fileinfo: fileinfo,
        })
        var filename = `input.${fileinfo.shortext}`
        await poopy.functions.downloadFile(currenturl2, `input2.${fileinfo2.shortext}`, {
            fileinfo: fileinfo2,
            filepath: filepath
        })
        var filename2 = `input2.${fileinfo2.shortext}`

        var width = fileinfo.info.width
        var height = fileinfo.info.height

        var size = [-1, height]

        var widthindex = args.indexOf('-width')
        if (widthindex > -1) {
            var percentage = String(args[widthindex + 1]).endsWith('%')
            if (percentage) {
                args[widthindex + 1] = args[widthindex + 1].substring(0, args[widthindex + 1].length - 1)
            }
            size[0] = (percentage ? width : 1) * ((isNaN(Number(args[widthindex + 1])) ? 0 : Number(args[widthindex + 1]) <= 0 ? 0 : Number(args[widthindex + 1]) || 0) / (percentage ? 100 : 1))
            size[1] = -1
        }

        var heightindex = args.indexOf('-height')
        if (heightindex > -1) {
            var percentage = String(args[heightindex + 1]).endsWith('%')
            if (percentage) {
                args[heightindex + 1] = args[heightindex + 1].substring(0, args[heightindex + 1].length - 1)
            }
            size[1] = (percentage ? height : 1) * ((isNaN(Number(args[heightindex + 1])) ? 0 : Number(args[heightindex + 1]) <= 0 ? 0 : Number(args[heightindex + 1]) || 0) / (percentage ? 100 : 1))
        } z

        if ((filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext))) && (filetype2.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype2.ext)))) {
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/${filename2} -filter_complex "[1:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100},scale=${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''}[chroma];[0:v][chroma]overlay=shortest=1:x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if ((filetype.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype.ext))) && ((filetype2.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === filetype2.ext)))) {
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/${filename} -i ${filepath}/${filename2} -filter_complex "[1:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100},scale=-1:${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''}[chroma];[0:v][chroma]overlay=shortest=1:x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto[qout];[qout]scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease[rout];[rout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if ((filetype.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === filetype.ext)) && (filetype2.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === filetype2.ext)))) {
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -stream_loop -1 -i ${filepath}/${filename2} -filter_complex "[1:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100},scale=-1:${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''}[chroma];[0:v][chroma]overlay=shortest=1:x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto[sout];[sout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else if (filetype.mime.startsWith('video') || filetype2.mime.startsWith('video')) {
            await poopy.functions.execPromise(`ffmpeg ${(filetype2.mime.startsWith('video') && !(filetype.mime.startsWith('video'))) ? '-stream_loop -1 ' : ''}-i ${filepath}/${filename} ${(filetype.mime.startsWith('video') && !(filetype2.mime.startsWith('video'))) ? '-stream_loop -1 ' : ''}-i ${filepath}/${filename2} -map ${filetype.mime.startsWith('video') ? '0' : '1'}:a? -filter_complex "[1:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100},scale=-1:${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''}[chroma];[0:v][chroma]overlay=shortest=1:x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto[sout];[sout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else {
            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/${filename} -i ${filepath}/${filename2} -filter_complex "[1:v]colorkey=${rgbhex}:${similarity / 100}:${blend / 100},scale=-1:${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''}[chroma];[0:v][chroma]overlay=shortest=1:x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto[rout];[rout]split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
        }
    },
    help: {
        name: 'chromakey/chroma <file> <chromakey> [-color <r> <g> <b>] [-similarity (from 0 to 100)] [-blend (from 0 to 100)] [-origin <x (left/center/right)> <y (top/middle/bottom)>] [-offsetpos <x> <y>] [-size <pixels>]',
        value: 'Adds the specified chroma key to the file. Default similarity and blend are 30.'
    },
    cooldown: 2500,
    type: 'Overlaying'
}