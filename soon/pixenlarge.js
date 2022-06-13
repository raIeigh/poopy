module.exports = {
    name: ['pixenlarge'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0) === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.functions.lastUrl(msg.guild.id, msg.channel.id, 0)
        var multiplier = isNaN(Number(args[1])) ? 3 : Number(args[1]) <= 2 ? 2 : Number(args[1]) >= 4 ? 4 : Math.round(Number(args[1])) || 3
        var filters = [
            'xbr',
            'hqx'
        ]
        var filter = 'xbr'
        var filterindex = args.indexOf('-filter')
        if (filterindex > -1) {
            if (filters.find(filter => filter === args[filterindex + 1].toLowerCase())) {
                filter = args[filterindex + 1]
            } else {
                await msg.channel.send('Not a supported filter.').catch(() => { })
                return
            }
        }
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(async error => {
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
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]alphaextract,${filter}=${multiplier}[mask];[0:v]${filter}=${multiplier}[input];[input][mask]alphamerge[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]alphaextract,${filter}=${multiplier}[mask];[0:v]${filter}=${multiplier}[input];[input][mask]alphamerge,scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            await poopy.functions.sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.gif`, {
                fileinfo: fileinfo
            })
            var filename = `input.gif`
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]alphaextract,${filter}=${multiplier}[mask];[0:v]${filter}=${multiplier}[input];[input][mask]alphamerge,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
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
        name: '<:newpoopy:839191885310066729> pixenlarge [multiplier (2, 3, 4)] <file> [-filter <type (xbr or hqx)>]',
        value: 'Enlarges the file, this is mostly designed for pixel art.'
    },
    cooldown: 2500,
    type: 'Resizing'
}