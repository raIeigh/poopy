module.exports = {
    name: ['mask', 'alphamerge'],
    args: [{ "name": "file", "required": false, "specifarg": false, "orig": "{file}" }, { "name": "mask", "required": false, "specifarg": false, "orig": "{mask}" }, { "name": "keep", "required": false, "specifarg": true, "orig": "[-keep]" }, {
        "name": "origin", "required": false, "specifarg": true, "orig": "[-origin <x (left/center/right)> <y (top/middle/bottom)>]",
        "autocomplete": [
            'left top',
            'center top',
            'right top',
            'left middle',
            'center middle',
            'right middle',
            'left bottom',
            'center bottom',
            'right bottom',
        ]
    }, { "name": "offsetpos", "required": false, "specifarg": true, "orig": "[-offsetpos <x> <y>]" }, { "name": "width", "required": false, "specifarg": true, "orig": "[-width/height <pixels or percentage>]" }, { "name": "height", "required": false, "specifarg": true, "orig": "[-width/height <pixels or percentage>]" }, { "name": "keepaspectratio", "required": false, "specifarg": true, "orig": "[-keepaspectratio <mode (increase or decrease)>]", "autocomplete": ['increase', 'decrease'] }],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, getUrls, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let vars = poopy.vars

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 1) === undefined && args[2] === undefined) {
            await msg.reply('What are the files?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
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
        var ox = 0
        var oy = 0
        var offsetindex = args.indexOf('-offsetpos')
        if (offsetindex > -1) {
            ox = isNaN(Number(String(args[offsetindex + 1]).replace(/,/g, ''))) ? 0 : Number(String(args[offsetindex + 1]).replace(/,/g, '')) || 0
            oy = isNaN(Number(String(args[offsetindex + 2]).replace(/,/g, ''))) ? 0 : Number(String(args[offsetindex + 2]).replace(/,/g, '')) || 0
        }
        var ratioindex = args.indexOf('-keepaspectratio')
        if (ratioindex > -1) {
            if (args[ratioindex + 1] == 'increase' || args[ratioindex + 1] == 'decrease') {
                keepaspectratio = args[ratioindex + 1]
            }
        }
        var currenturl = lastUrl(msg, 0) || args[1]
        var currenturl2 = lastUrl(msg, 1) || args[2]
        var urls = await getUrls(msg).catch(() => { }) ?? []
        if (urls.length < 2) {
            var c = currenturl
            currenturl = currenturl2
            currenturl2 = c
        }
        var errors = {}
        var fileinfo = await validateFile(currenturl, false, {
            size: `the first file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the first file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the first file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the first file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo) return
        var filetype = fileinfo.type
        var fileinfo2 = await validateFile(currenturl2, false, {
            size: `the second file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`,
            frames: `the frames of the second file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`,
            width: `the width of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`,
            height: `the height of the second file exceeds the limit of {param} hahahaha (try to use the shrink command)`
        }).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })
        if (!fileinfo2) return
        var filetype2 = fileinfo2.type
        var filetypes = [filetype, filetype2]
        for (var i in errors) {
            var error = errors[i]
            if (error) {
                await msg.reply({
                    content: error,
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return
            }
        }
        for (var i in filetypes) {
            var type = filetypes[i]
            if (!(type.mime.startsWith('image') || type.mime.startsWith('video'))) {
                await msg.reply({
                    content: 'Unsupported file types.',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                return
            }
        }
        var filepath = await downloadFile(currenturl, `input.${fileinfo.shortext}`, {
            fileinfo,
        })
        var filename = `input.${fileinfo.shortext}`
        await downloadFile(currenturl2, `input2.${fileinfo2.shortext}`, {
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
        }

        if ((filetype.mime.startsWith('image') && !(vars.gifFormats.find(f => f === filetype.ext))) && (filetype2.mime.startsWith('image') && !(vars.gifFormats.find(f => f === filetype2.ext)))) {
            await execPromise(`ffmpeg -i ${filepath}/${filename} -i ${filepath}/${filename2} -f lavfi -i "color=0x${args.find(arg => arg === '-keep') ? 'FFFFFF' : '000000'}FF:s=${width}x${height},format=rgba" -filter_complex "[1:v]scale=${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''},hue=s=0[overlay];[2:v][overlay]overlay=x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto[mask];[0:v][mask]alphamerge[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if ((filetype.mime.startsWith('image') && !(vars.gifFormats.find(f => f === filetype.ext))) && ((filetype2.mime.startsWith('image') && vars.gifFormats.find(f => f === filetype2.ext)))) {
            await execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/${filename} -i ${filepath}/${filename2} -f lavfi -i "color=0x${args.find(arg => arg === '-keep') ? 'FFFFFF' : '000000'}FF:s=${width}x${height},format=rgba" -filter_complex "[1:v]scale=${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''},hue=s=0[overlay];[2:v][overlay]overlay=x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto,colorkey=0xFFFFFF:0.01:0,curves=r='0/0 1/0':g='0/0 1/${172/255}':b='0/0 1/${145/255}'[mask];[0:v][mask]overlay=shortest=1:x=0:y=0:format=auto,colorkey=0x00AC91:0.01:0,scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else if ((filetype.mime.startsWith('image') && vars.gifFormats.find(f => f === filetype.ext)) && (filetype2.mime.startsWith('image') && !(vars.gifFormats.find(f => f === filetype2.ext)))) {
            await execPromise(`ffmpeg -i ${filepath}/${filename} -stream_loop -1 -i ${filepath}/${filename2} -f lavfi -i "color=0x${args.find(arg => arg === '-keep') ? 'FFFFFF' : '000000'}FF:s=${width}x${height},format=rgba" -filter_complex "[1:v]scale=${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''},hue=s=0[overlay];[2:v][overlay]overlay=x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto,colorkey=0xFFFFFF:0.01:0,curves=r='0/0 1/0':g='0/0 1/${172/255}':b='0/0 1/${145/255}'[mask];[0:v][mask]overlay=shortest=1:x=0:y=0:format=auto,colorkey=0x00AC91:0.01:0,split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else if (filetype.mime.startsWith('video') || filetype2.mime.startsWith('video')) {
            await execPromise(`ffmpeg ${(filetype2.mime.startsWith('video') && !(filetype.mime.startsWith('video'))) ? '-stream_loop -1 ' : ''}-i ${filepath}/${filename} ${(filetype.mime.startsWith('video') && !(filetype2.mime.startsWith('video'))) ? '-stream_loop -1 ' : ''}-i ${filepath}/${filename2} -f lavfi -i "color=0x${args.find(arg => arg === '-keep') ? 'FFFFFF' : '000000'}FF:s=${width}x${height},format=rgba" -map ${filetype.mime.startsWith('video') ? '0' : '1'}:a? -filter_complex "[1:v]scale=${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''},hue=s=0[overlay];[2:v][overlay]overlay=x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto,colorkey=0xFFFFFF:0.01:1,curves=r='0/0 1/0':g='0/0 1/0':b='0/0 1/0'[mask];[0:v][mask]overlay=shortest=1:format=auto:x=0:y=0,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else {
            await execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/${filename} -i ${filepath}/${filename2} -f lavfi -i "color=0x${args.find(arg => arg === '-keep') ? 'FFFFFF' : '000000'}FF:s=${width}x${height},format=rgba" -filter_complex "[1:v]scale=${size[0]}:${size[1]}${keepaspectratio ? `:force_original_aspect_ratio=${keepaspectratio}` : ''},hue=s=0[overlay];[2:v][overlay]overlay=x=${originx}+${Math.round(ox)}:y=${originy}+${Math.round(oy)}:format=auto,colorkey=0xFFFFFF:0.01:0,curves=r='0/0 1/0':g='0/0 1/${172/255}':b='0/0 1/${145/255}'[mask];[0:v][mask]overlay=shortest=1:x=0:y=0:format=auto,colorkey=0x00AC91:0.01:0,split[gnout][gpout];[gpout]palettegen=reserve_transparent=1[palette];[gnout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        }
    },
    help: {
        name: 'mask/alphamerge {file} {mask} [-keep] [overlay options]',
        value: 'Uses the specified mask on the file. Might not work well on GIFs though!'
    },
    cooldown: 2500,
    type: 'Overlaying'
}