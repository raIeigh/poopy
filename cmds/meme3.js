module.exports = {
    name: ['meme3', 'caption'],
    execute: async function (msg, args, pathObject) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && poopy.vars.validUrl.test(args[args.length - 1]) === false) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var size = 1
        var sizeindex = args.indexOf('-size')
        if (sizeindex > -1) {
            size = isNaN(Number(args[sizeindex + 1])) ? 1 : Number(args[sizeindex + 1]) <= 0.5 ? 0.5 : Number(args[sizeindex + 1]) >= 5 ? 5 : Number(args[sizeindex + 1]) || 1
        }
        var saidMessage = args.join(' ').substring(args[0].length + 1).replace(/’/g, '\'')
        poopy.vars.symbolreplacements.forEach(symbolReplacement => {
            symbolReplacement.target.forEach(target => {
                saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
            })
        })
        var matchedTextes = saidMessage.match(/"([\s\S]*?)"/g)
        if (!matchedTextes) {
            matchedTextes = ['""']
        }
        var text = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo

        if (pathObject) {
            fileinfo = await poopy.functions.validateFileFromPath(`${pathObject.path}/${pathObject.name}`).catch(error => {
                msg.channel.send(error)
                msg.channel.sendTyping().catch(() => { })
                return;
            })
        } else {
            fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
                msg.channel.send(error)
                msg.channel.sendTyping().catch(() => { })
                return;
            })
        }

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath
            var filename
            var object

            if (pathObject) {
                filepath = pathObject.path
                filename = pathObject.name
                object = pathObject
                object.chaincount++
                object.name = `output${object.chaincount}.png`
                if (!object.otherNames) {
                    object.otherNames = {}
                }
                object.otherNames.caption = `caption${object.chaincount}.png`
            } else {
                filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                    fileinfo: fileinfo
                })
                filename = `input.png`
                object = {
                    path: filepath,
                    name: `output.png`,
                    otherNames: {
                        caption: `caption.png`
                    },
                    chaincount: 0
                }
            }

            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var white = await poopy.modules.Jimp.read('templates/white.png')
            var futura = await poopy.modules.Jimp.loadFont('templates/fonts/FuturaCondensed/FuturaCondensed.fnt')
            white.resize(width, height)
            white.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var defaultheight = futura.common.lineHeight
            var textheight = poopy.modules.Jimp.measureTextHeight(futura, text, white.bitmap.width - Math.round(160 / size))
            white.resize(Math.round(2000 / size), textheight + Math.round(160 / size))
            await white.print(futura, Math.round(80 / size), Math.round(80 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, white.bitmap.width - Math.round(160 / size), white.bitmap.height - Math.round(160 / size))
            white.resize(width, poopy.modules.Jimp.AUTO)
            await white.writeAsync(`${filepath}/${object.otherNames.caption}`)

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${object.otherNames.caption} -i ${filepath}/${filename} -filter_complex "vstack=inputs=2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/${object.name}`)

            if (args.join(' ').includes('-chain')) {
                return object
            } else {
                await poopy.functions.sendFile(msg, filepath, object.name)
            }
        } else if (type.mime.startsWith('video')) {
            var filepath
            var filename
            var object

            if (pathObject) {
                filepath = pathObject.path
                filename = pathObject.name
                object = pathObject
                object.chaincount++
                object.name = `output${object.chaincount}.mp4`
                if (!object.otherNames) {
                    object.otherNames = {}
                }
                object.otherNames.caption = `caption${object.chaincount}.png`
            } else {
                filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                    fileinfo: fileinfo
                })
                filename = `input.mp4`
                object = {
                    path: filepath,
                    name: `output.mp4`,
                    otherNames: {
                        caption: `caption.png`
                    },
                    chaincount: 0
                }
            }

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var fps = fileinfo.info.fps

            var white = await poopy.modules.Jimp.read('templates/white.png')
            var futura = await poopy.modules.Jimp.loadFont('templates/fonts/FuturaCondensed/FuturaCondensed.fnt')
            white.resize(width, height)
            white.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var defaultheight = futura.common.lineHeight
            var textheight = poopy.modules.Jimp.measureTextHeight(futura, text, white.bitmap.width - Math.round(160 / size))
            white.resize(Math.round(2000 / size), textheight + Math.round(160 / size))
            await white.print(futura, Math.round(80 / size), Math.round(80 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, white.bitmap.width - Math.round(160 / size), white.bitmap.height - Math.round(160 / size))
            white.resize(width, poopy.modules.Jimp.AUTO)
            await white.writeAsync(`${filepath}/${object.otherNames.caption}`)

            await poopy.functions.execPromise(`ffmpeg ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/${object.otherNames.caption} ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/${filename} -map 1:a? -filter_complex "vstack=inputs=2[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/${object.name}`)

            if (args.join(' ').includes('-chain')) {
                return object
            } else {
                await poopy.functions.sendFile(msg, filepath, object.name)
            }
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath
            var filename
            var object

            if (pathObject) {
                filepath = pathObject.path
                filename = pathObject.name
                object = pathObject
                object.chaincount++
                object.name = `output${object.chaincount}.gif`
                if (!object.otherNames) {
                    object.otherNames = {}
                }
                object.otherNames.caption = `caption${object.chaincount}.png`
            } else {
                filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                    fileinfo: fileinfo
                })
                filename = `input.gif`
                object = {
                    path: filepath,
                    name: `output.gif`,
                    otherNames: {
                        caption: `caption.png`
                    },
                    chaincount: 0
                }
            }

            var width = fileinfo.info.width
            var height = fileinfo.info.height
            var fps = fileinfo.info.fps

            var white = await poopy.modules.Jimp.read('templates/white.png')
            var futura = await poopy.modules.Jimp.loadFont('templates/fonts/FuturaCondensed/FuturaCondensed.fnt')
            white.resize(width, height)
            white.resize(Math.round(2000 / size), poopy.modules.Jimp.AUTO)
            var defaultheight = futura.common.lineHeight
            var textheight = poopy.modules.Jimp.measureTextHeight(futura, text, white.bitmap.width - Math.round(160 / size))
            white.resize(Math.round(2000 / size), textheight + Math.round(160 / size))
            await white.print(futura, Math.round(80 / size), Math.round(80 / size), { text: poopy.modules.Discord.Util.cleanContent(text, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, white.bitmap.width - Math.round(160 / size), white.bitmap.height - Math.round(160 / size))
            white.resize(width, poopy.modules.Jimp.AUTO)
            await white.writeAsync(`${filepath}/${object.otherNames.caption}`)

            await poopy.functions.execPromise(`ffmpeg ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/${object.otherNames.caption} ${fps.includes('0/0') ? '' : `-r ${fps.includes('0/0') ? '50' : fps} `}-i ${filepath}/${filename} -filter_complex "vstack=inputs=2[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/${object.name}`)

            if (args.join(' ').includes('-chain')) {
                return object
            } else {
                await poopy.functions.sendFile(msg, filepath, object.name)
            }
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'meme3/caption "{text}" <file> [-size <multiplier (from 0.5 to 5)>]',
        value: 'Adds a white box caption to the file.'
    },
    cooldown: 2500,
    type: 'Captions'
}