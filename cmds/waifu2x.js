module.exports = {
    name: ['waifu2x'],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            await msg.channel.send('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]

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
            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/${filename} -vf alphaextract -preset ${poopy.functions.findpreset(args)} ${filepath}/mask.png`)

            var resp = await poopy.modules.deepai.callStandardApi("waifu2x", {
                image: poopy.modules.fs.createReadStream(`${filepath}/${filename}`),
            }).catch(() => { })
            var maskresp = await poopy.modules.deepai.callStandardApi("waifu2x", {
                image: poopy.modules.fs.createReadStream(`${filepath}/mask.png`),
            }).catch(() => { })

            if (!resp || !maskresp) {
                await msg.channel.send(`Couldn't process file.`)
                return
            }

            await poopy.functions.downloadFile(resp.output_url, `waifu2xinput.png`, {
                filepath: filepath,
                ffmpeg: true
            })
            await poopy.functions.downloadFile(maskresp.output_url, `waifu2xmask.png`, {
                filepath: filepath,
                ffmpeg: true
            })

            await poopy.functions.execPromise(`ffmpeg -i ${filepath}/waifu2xinput.png -i ${filepath}/waifu2xmask.png -filter_complex "[0:v][1:v]alphamerge[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} ${filepath}/output.png`)
            await poopy.functions.sendFile(msg, filepath, `output.png`)
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
        name: '<:newpoopy:839191885310066729> waifu2x <image>',
        value: 'Upscales the image and reduces its noise with Waifu2x. Try it yourself at http://waifu2x.udp.jp/'
    },
    cooldown: 2500,
    type: 'Resizing'
}