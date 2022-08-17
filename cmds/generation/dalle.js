module.exports = {
    name: ['dalle', 'craiyon', 'text2images'],
    args: [{"name":"prompt","required":true,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        if (!args[1]) {
            await msg.channel.send('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var text = args.slice(1).join(' ')

        var waitMsg = await msg.channel.send(`Haha... This might take a century`).catch(() => { })

        var processInterval = setInterval(async () => {
            await msg.channel.sendTyping().catch(() => { })
        }, 5000)
        await msg.channel.sendTyping().catch(() => { })

        var retries = 0

        async function dalleRequest() {
            var imageRes = await poopy.modules.axios.request({
                url: 'https://backend.craiyon.com/generate',
                method: 'POST',
                data: { prompt: text }
            }).catch(() => { })

            if (!imageRes) {
                retries++
                if (retries >= 5) {
                    clearInterval(processInterval)
                    if (waitMsg) waitMsg.edit('Too much traffic, try again later.').catch(() => { })
                    throw new Error('Too much traffic')
                }

                if (waitMsg) waitMsg.edit(`Haha... This might take a century (attempt ${retries})`).catch(() => { })
                await poopy.functions.sleep(2000)
                return await dalleRequest()
            }

            clearInterval(processInterval)
            waitMsg.delete().catch(() => { })

            return imageRes
        }

        var imageRes = await dalleRequest().catch(() => { })
        if (!imageRes) return

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
                },

                {
                    emoji: '874406183933444156',
                    reactemoji: '❌',
                    customid: 'delete',
                    style: 'DANGER',
                    function: async (_, __, resultsMsg, collector) => {
                        collector.stop()
                        resultsMsg.delete().catch(() => { })
                    },
                    page: false
                }
            ], undefined, undefined, undefined, (reason) => {
                if (reason == 'time') poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
            }, msg)
        })

        archive.pipe(output)
        archive.directory(`${filepath}/images`, false)
        archive.finalize()
    },
    help: {
        name: 'dalle/craiyon/text2images <prompt>',
        value: 'Generates 9 images from the text prompt using DALL·E mini. Try it yourself at https://huggingface.co/spaces/dalle-mini/dalle-mini'
    },
    cooldown: 5000,
    type: 'Generation'
}