module.exports = {
    name: ['battler', 'battlebricks', 'tbb'],
    args: [{
        name: "type",
        required: false,
        specifarg: false,
        orig: "[type]",
        autocomplete: function () {
            return [
                { name: "Friendlies", value: "friendly" },
                { name: "Enemies", value: "enemy" }
            ]
        }
    }],
    execute: async function (msg, args, opts = {}) {
        let poopy = this
        let { findCommand } = poopy.functions

        var findCmd = findCommand('larp')

        var battlerValue = "tbb" + args.slice(1).join(" ").trim()
        var battlerArgs = battlerValue.split(" ")

        await findCmd.execute.call(poopy, msg, ['larp', ...battlerArgs], opts).catch(async err => {
            await msg.reply({
                content: err.stack,
                allowedMentions: fetchPingPerms(msg)
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
        })
    },
    help: {
        name: 'battler/battlebricks/tbb [type (friendly or enemy)] (manage webhooks/messages permission only)',
        value: "I'm Battler, and I'm always battling! Many of the unofficial renders were made by GamerVenata!"
    },
    cooldown: 2500,
    perms: [
        'Administrator',
        'ManageMessages',
        'ManageWebhooks',
        'ManageGuild'
    ],
    type: 'Inside Joke'
}
