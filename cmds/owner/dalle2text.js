module.exports = {
    name: ['dalle2text'],
    args: [{"name":"prompt","required":true,"specifarg":false,"orig":"<prompt>"}],
    execute: async function (msg, args, opts) {
        let poopy = this
        let config = poopy.config
        let modules = poopy.modules
        let { sleep, navigateEmbed } = poopy.functions
        let bot = poopy.bot

        var ownerid = config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined && !opts.ownermode) {
            await msg.reply('Owner only!').catch(() => { })
            return
        }

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

        function fail() {
            clearInterval(processInterval)
            waitMsg.edit('I failed.').catch(() => { })
        }

        async function dalle2Request() {
            var taskRes = await modules.axios.request({
                url: 'https://labs.openai.com/api/labs/tasks',
                method: 'POST',
                data: {
                    prompt: {
                        batch_size: 4,
                        caption: text
                    },
                    task_type: "text2im"
                },
                headers: {
                    Authorization: `Bearer ${process.env.DALLE2KEY}`
                }
            }).catch(() => { })

            if (!taskRes) {
                fail()
                return
            }

            var taskId = taskRes.data.id
            var imageRes

            while (!imageRes) {
                await sleep(20000)

                var taskCompleteRes = await modules.axios.request({
                    url: `https://labs.openai.com/api/labs/tasks/${taskId}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${process.env.DALLE2KEY}`
                    }
                })

                if (taskCompleteRes) {
                    var status = taskCompleteRes.data.status

                    if (status == 'succeeded') {
                        imageRes = taskCompleteRes
                        break
                    } else if (status == 'rejected') {
                        fail()
                        return
                    }
                }
            }

            clearInterval(processInterval)
            waitMsg.delete().catch(() => { })

            return imageRes
        }

        var imageRes = await dalle2Request().catch(() => { })
        if (!imageRes) return

        var images = imageRes.data.generatidata.map(gdata => gdata.generation.image_path)

        await navigateEmbed(msg.channel, async (page) => {
            if (config.textEmbeds) return `${images[page - 1]}\n\nImage ${page}/${images.length}`
            else return {
                "title": `DALL·E 2 results for ${text}`,
                "color": 0x472604,
                "image": {
                    "url": images[page - 1]
                },
                "footer": {
                    "icon_url": bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                    "text": `Image ${page}/${images.length}`
                },
            }
        }, images.length, msg.member, [
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
        ], undefined, undefined, undefined, undefined, msg)
    },
    help: {
        name: 'dalle2text <option>',
        value: "Generates 4 images from the text prompt with DALL·E 2. Owner only because credits are very limited."
    },
    cooldown: 2500,
    type: 'Owner',
    envRequired: ['DALLE2KEY']
}