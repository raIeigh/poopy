module.exports = {
    name: ['dalle', 'text2images'],
    execute: async function (msg, args) {
        let poopy = this

        if (!args[1]) {
            await msg.channel.send('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var text = args.slice(1).join(' ')

        var processInterval = setInterval(async () => {
            await msg.channel.sendTyping().catch(() => { })
        }, 5000)
        var waitMsg = await msg.channel.send('Haha... this might take a century...').catch(() => { })
        await msg.channel.sendTyping().catch(() => { })

        var imageRes = await poopy.modules.axios.request({
            url: 'https://bf.dallemini.ai/generate',
            method: 'POST',
            data: { prompt: text }
        }).catch(() => { })

        if (waitMsg) waitMsg.delete().catch(() => { })
        clearInterval(processInterval)

        if (!imageRes) {
            await msg.channel.send('Too much traffic, try again later.').catch(() => { })
            return
        }

        var images = imageRes.data.images

        var currentcount = poopy.vars.filecount
        poopy.vars.filecount++
        var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
        poopy.modules.fs.mkdirSync(`${filepath}`)
        poopy.modules.fs.mkdirSync(`${filepath}/images`)

        var i = 0

        images.forEach(data => {
            i++
            poopy.modules.fs.writeFileSync(`${filepath}/images/image${i}.png`, Buffer.from(data, 'base64'))
        })

        var output = poopy.modules.fs.createWriteStream(`${filepath}/output.zip`)
        var archive = poopy.modules.archiver('zip')

        output.on('finish', async () => {
            var frames = poopy.modules.fs.readdirSync(`${filepath}/images`)
            var catboxframes = {}

            await poopy.functions.navigateEmbed(msg.channel, async (page, ended) => {
                var frameurl = ended ? await poopy.vars.Catbox.upload(`${filepath}/images/${frames[page - 1]}`).catch(() => { }) : catboxframes[frames[page - 1]]

                if (!frameurl && !ended) {
                    frameurl = await poopy.vars.Litterbox.upload(`${filepath}/images/${frames[page - 1]}`).catch(() => { }) ?? ''
                    catboxframes[frames[page - 1]] = frameurl
                }

                if (poopy.config.textEmbeds) return `${frameurl}\n\nImage ${page}/${frames.length}`
                else return {
                    "title": `DALL·E results for ${text}`,
                    "color": 0x472604,
                    "image": {
                        "url": frameurl
                    },
                    "footer": {
                        "icon_url": poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        "text": `Image ${page}/${frames.length}`
                    },
                }
            }, frames.length, msg.member, [
                {
                    emoji: '939523064658526278',
                    reactemoji: '⏬',
                    customid: 'zip',
                    style: 'PRIMARY',
                    function: async (_, __, resultsMsg, collector) => {
                        collector.stop()
                        resultsMsg.delete().catch(() => { })
                        poopy.functions.sendFile(msg, filepath, `output.zip`)
                    },
                    page: false
                }
            ], undefined, undefined, undefined, (reason) => {
                if (reason == 'time') poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
            })
        })

        archive.pipe(output)
        archive.directory(`${filepath}/images`, false)
        archive.finalize()
    },
    help: {
        name: '<:newpoopy:839191885310066729> dalle/getframes <prompt>',
        value: 'Creates 9 images from the text prompt using DALL·E. Try it yourself at https://huggingface.co/spaces/dalle-mini/dalle-mini'
    },
    cooldown: 5000,
    type: 'Generation'
}