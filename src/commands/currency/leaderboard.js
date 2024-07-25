module.exports = {
    name: ['leaderboard'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let bot = poopy.bot
        let data = poopy.data
        let config = poopy.config
        let { chunkArray, toOrdinal, navigateEmbed } = poopy.functions

        await msg.channel.sendTyping().catch(() => { })

        var leaderboard = data.botData.leaderboard
        var leaderIds = Object.keys(leaderboard)

        leaderIds.sort((a, b) => leaderboard[b].bucks - leaderboard[a].bucks)

        var leadertext = []
        var leaderpos = leaderIds.indexOf(msg.author.id) + 1

        for (var i in leaderIds) {
            var id = leaderIds[i]
            var leaderdata = leaderboard[id]
            leadertext.push(`\`${Number(i) + 1}.\` ${leaderdata.tag} - **${leaderdata.bucks} P$**`)
        }

        var leaderParts = chunkArray(leadertext, 10)

        if (!msg.nosend) await navigateEmbed(msg.channel, async (page) => {
            if (config.textEmbeds) return `${leaderParts[page - 1].join('\n')}\n\nYou are in ${toOrdinal(leaderpos)} place`
            else return {
                title: `Global Leaderboard`,
                description: leaderParts[page - 1].join('\n'),
                color: 0x472604,
                footer: {
                    icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' }),
                    text: `You are in ${toOrdinal(leaderpos)} place`
                }
            }
        }, leaderParts.length, msg.member, undefined, undefined, undefined, undefined, undefined, msg)

        return `${leaderParts[0].join('\n')}\n\nYou are in ${toOrdinal(leaderpos)} place`
    },
    help: {
        name: 'leaderboard',
        value: "Displays the bot's money leaderboard."
    },
    cooldown: 2500,
    type: 'Currency'
}