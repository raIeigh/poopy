module.exports = {
    name: ['vshrink'],
    args: [{ "name": "multiplier", "required": false, "specifarg": false, "orig": "[multiplier (from 1 to 6)]" }, { "name": "file", "required": false, "specifarg": false, "orig": "{file}" }, {
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
    }],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions
        let { DiscordTypes } = poopy.modules
        let vars = poopy.vars

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0)
        var multiplier = isNaN(Number(args[1])) ? 2 : Number(args[1]) <= 1 ? 1 : Number(args[1]) >= 6 ? 6 : Number(args[1]) || 2
        var flags = [
            'fast_bilinear',
            'bilinear',
            'bicubic',
            'experimental',
            'neighbor',
            'area',
            'bicublin',
            'gauss',
            'sinc',
            'lanczos',
            'spline',
            'print_info',
            'accurate_rnd',
            'full_chroma_int',
            'full_chroma_inp',
            'bitexact'
        ]
        var flag = undefined
        var flagsindex = args.indexOf('-flags')
        if (flagsindex > -1) {
            if (flags.find(flag => flag === args[flagsindex + 1].toLowerCase())) {
                flag = args[flagsindex + 1]
            } else {
                await msg.reply('Not a supported flag.').catch(() => { })
                return
            }
        }
        var fileinfo = await validateFile(currenturl, true).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo            })
            var filename = `input.png`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=iw:round(ih/${multiplier})${flag ? `:flags=${flag}` : ''}[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo            })
            var filename = `input.mp4`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await execPromise(`ffmpeg -i ${filepath}/${filename} -map 0:a? -filter_complex "[0:v]scale=iw:round(ih/${multiplier})${flag ? `:flags=${flag}` : ''},scale=ceil(iw/2)*2:ceil(ih/2)*2${flag ? `:flags=${flag}` : ''}[out]" -map "[out]" -preset ${findpreset(args)} -aspect ${width}:${Math.round(height / multiplier)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`, {
                fileinfo            })
            var filename = `input.gif`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await execPromise(`ffmpeg -i ${filepath}/${filename} -filter_complex "[0:v]scale=iw:round(ih/${multiplier})${flag ? `:flags=${flag}` : ''},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -aspect ${width}:${Math.round(height / multiplier)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) && !msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.MentionEveryone) && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'vshrink [multiplier (from 1 to 6)] {file} [-flags <algorithm>]',
        value: 'Shrinks the file vertically. A list of flags can be found at https://ffmpeg.org/ffmpeg-scaler.html#Scaler-Options'
    },
    cooldown: 2500,
    type: 'Resizing'
}