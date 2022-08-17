module.exports = {
    name: ['perspective'],
    args: [{"name":"file","required":false,"specifarg":false},{"name":"tl","required":false,"specifarg":true},{"name":"tr","required":false,"specifarg":true},{"name":"bl","required":false,"specifarg":true},{"name":"br","required":false,"specifarg":true}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg, 0)
        var fileinfo = await poopy.functions.validateFile(currenturl, true).catch(async error => {
            await msg.channel.send(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.png`, {
                fileinfo: fileinfo
            })
            var filename = `input.png`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var points = {
                tl: [0, 0],
                tr: [width, 0],
                bl: [0, height],
                br: [width, height]
            }

            for (var i in points) {
                var pointindex = args.indexOf(`-${i}`)
                if (pointindex > -1) {
                    var xpercentage = String(args[pointindex + 1]).endsWith('%')
                    if (xpercentage) {
                        args[pointindex + 1] = args[pointindex + 1].substring(0, args[pointindex + 1].length - 1)
                    }
                    points[i][0] = (xpercentage ? width : 1) * ((isNaN(Number(args[pointindex + 1])) ? points[i][0] : Number(args[pointindex + 1]) || points[i][0]) / (xpercentage ? 100 : 1))

                    var ypercentage = String(args[pointindex + 2]).endsWith('%')
                    if (ypercentage) {
                        args[pointindex + 2] = args[pointindex + 2].substring(0, args[pointindex + 2].length - 1)
                    }
                    points[i][1] = (ypercentage ? height : 1) * ((isNaN(Number(args[pointindex + 2])) ? points[i][1] : Number(args[pointindex + 2]) || points[i][1]) / (ypercentage ? 100 : 1))
                }
            }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]perspective=${points['tl'][0]}:${points['tl'][1]}:${points['tr'][0]}:${points['tr'][1]}:${points['bl'][0]}:${points['bl'][1]}:${points['br'][0]}:${points['br'][1]}[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            return await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var points = {
                tl: [0, 0],
                tr: [width, 0],
                bl: [0, height],
                br: [width, height]
            }

            for (var i in points) {
                var pointindex = args.indexOf(`-${i}`)
                if (pointindex > -1) {
                    var xpercentage = String(args[pointindex + 1]).endsWith('%')
                    if (xpercentage) {
                        args[pointindex + 1] = args[pointindex + 1].substring(0, args[pointindex + 1].length - 1)
                    }
                    points[i][0] = (xpercentage ? width : 1) * ((isNaN(Number(args[pointindex + 1])) ? points[i][0] : Number(args[pointindex + 1]) || points[i][0]) / (xpercentage ? 100 : 1))

                    var ypercentage = String(args[pointindex + 2]).endsWith('%')
                    if (ypercentage) {
                        args[pointindex + 2] = args[pointindex + 2].substring(0, args[pointindex + 2].length - 1)
                    }
                    points[i][1] = (ypercentage ? height : 1) * ((isNaN(Number(args[pointindex + 2])) ? points[i][1] : Number(args[pointindex + 2]) || points[i][1]) / (ypercentage ? 100 : 1))
                }
            }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]perspective=${points['tl'][0]}:${points['tl'][1]}:${points['tr'][0]}:${points['tr'][1]}:${points['bl'][0]}:${points['bl'][1]}:${points['br'][0]}:${points['br'][1]},scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            var points = {
                tl: [0, 0],
                tr: [width, 0],
                bl: [0, height],
                br: [width, height]
            }

            for (var i in points) {
                var pointindex = args.indexOf(`-${i}`)
                if (pointindex > -1) {
                    var xpercentage = String(args[pointindex + 1]).endsWith('%')
                    if (xpercentage) {
                        args[pointindex + 1] = args[pointindex + 1].substring(0, args[pointindex + 1].length - 1)
                    }
                    points[i][0] = (xpercentage ? width : 1) * ((isNaN(Number(args[pointindex + 1])) ? points[i][0] : Number(args[pointindex + 1]) || points[i][0]) / (xpercentage ? 100 : 1))

                    var ypercentage = String(args[pointindex + 2]).endsWith('%')
                    if (ypercentage) {
                        args[pointindex + 2] = args[pointindex + 2].substring(0, args[pointindex + 2].length - 1)
                    }
                    points[i][1] = (ypercentage ? height : 1) * ((isNaN(Number(args[pointindex + 2])) ? points[i][1] : Number(args[pointindex + 2]) || points[i][1]) / (ypercentage ? 100 : 1))
                }
            }

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]perspective=${points['tl'][0]}:${points['tl'][1]}:${points['tr'][0]}:${points['tr'][1]}:${points['bl'][0]}:${points['bl'][1]}:${points['br'][0]}:${points['br'][1]},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
    help: {
        name: 'perspective {file} [-tl <x> <y> (pixels or percentage)] [-tr <x> <y> (pixels or percentage)] [-bl <x> <y> (pixels or percentage)] [-br <x> <y> (pixels or percentage)]',
        value: 'Changes the perspective of the file depending on the coordinates specified for each point.'
    },
    cooldown: 2500,
    type: 'Resizing'
}