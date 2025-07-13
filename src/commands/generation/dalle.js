module.exports = {
    name: ['dalle', 'craiyon', 'text2images'],
    args: [{ "name": "prompt", "required": true, "specifarg": false, "orig": "<prompt>" }],
    execute: async function (msg, args) {
        let poopy = this
        let { axios, fs, DiscordTypes } = poopy.modules
        let { sleep, navigateEmbed } = poopy.functions
        let vars = poopy.vars
        let config = poopy.config
        let bot = poopy.bot

        if (!args[1]) {
            await msg.reply('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }

        var text = args.slice(1).join(' ')

        var waitMsg = await msg.reply(`Haha... This might take a century`).catch(() => { })

        var processInterval = setInterval(async () => {
            await msg.channel.sendTyping().catch(() => { })
        }, 5000)
        await msg.channel.sendTyping().catch(() => { })

        var retries = 0

        async function dalleRequest() {
            var imageRes = await axios({
                url: 'https://api.craiyon.com/v3',
                method: 'POST',
                data: {
                    model: "art",
                    negative_prompt: "",
                    prompt: text,
                    token: null,
                    version: "c4ue22fb7kb6wlac"
                }
            }).catch(e => console.log(e))

            if (!imageRes) {
                retries++
                if (retries >= 5) {
                    clearInterval(processInterval)
                    if (waitMsg) waitMsg.edit('Too much traffic, try again later.').catch(() => { })
                    throw new Error('Too much traffic')
                }

                if (waitMsg) waitMsg.edit(`Haha... This might take a century (attempt ${retries})`).catch(() => { })
                await sleep(2000)
                return await dalleRequest()
            }

            clearInterval(processInterval)
            waitMsg.delete().catch(() => { })

            return imageRes
        }

        var imageRes = await dalleRequest().catch(() => { })
        if (!imageRes) return

        var images = imageRes.data.images

        var frames = images.map(u => `https://pics.craiyon.com/${u}`)

        if (!msg.nosend) await navigateEmbed(msg.channel, async (page, ended) => {
            var frameurl = ended ? await vars.Catbox.upload(frames[page - 1]).catch(() => { }) : frames[page - 1]

            if (config.textEmbeds) return `${frameurl}\n\nImage ${page}/${frames.length}`
            else return {
                "title": `DALL·E results for ${text}`,
                "color": 0x472604,
                "image": {
                    "url": frameurl
                },
                "footer": {
                    "icon_url": bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                    "text": `Image ${page}/${frames.length}`
                },
            }
        }, frames.length, msg.member, [
            {
                emoji: '874406183933444156',
                reactemoji: '❌',
                customid: 'delete',
                style: DiscordTypes.ButtonStyle.Danger,
                function: async (_, __, resultsMsg, collector) => {
                    collector.stop()
                    resultsMsg.delete().catch(() => { })
                },
                page: false
            }
        ], undefined, undefined, undefined, (reason) => {
            if (reason == 'time') fs.rmSync(filepath, { force: true, recursive: true })
        }, msg)
        return frames[0]
    },
    help: {
        name: 'dalle/craiyon/text2images <prompt>',
        value: 'Generates 9 images from the text prompt using DALL·E mini. Try it yourself at https://huggingface.co/spaces/dalle-mini/dalle-mini'
    },
    cooldown: 5000,
    type: 'Generation'
}
