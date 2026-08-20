module.exports = {
    name: ['doopley'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let bot = poopy.bot
        let json = poopy.json
        let config = poopy.config
        let { Discord } = poopy.modules
        let { randomChoice, fetchPingPerms } = poopy.functions

        const { textes, images } = json.doopleyJSON

        const text1 = randomChoice(textes)
        const text2 = randomChoice(textes)

        const image = new Discord.AttachmentBuilder(`https://assetdelivery.vercel.app/${randomChoice(images)}.png`, { name: "doopley.png" })

        if (!msg.nosend) {
            if (config.textEmbeds) await msg.reply({
                content: `# ${text1.substring(0, 256)}\n${text2}`,
                files: [image],
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })

            else await msg.reply({
                embeds: [
                    {
                        title: text1.substring(0, 256),
                        description: text2,
                        color: Math.floor(Math.random() * 0x1000000),
                        image: {
                            url: `attachment://doopley.png`
                        }
                    }
                ],
                files: [image],
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
        }
        return `# ${text1.substring(0, 256)}\n${text2}`
    },
    help: {
        name: 'doopley',
        value: 'Refrain from using this command at all costs. Based off of the following Roblox game: https://www.roblox.com/games/18230294132/doopley'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}
