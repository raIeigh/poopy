module.exports = {
    name: ['slam'],
    args: [{
        "name": "subject", "required": true, "specifarg": false, "orig": "<subject>",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data.guildData[interaction.guild.id]['allMembers']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        let { battle } = poopy.functions
        var action = '**{src}** slammed **{trgt}**! It did **{dmg}** damage!'
        var damage = 30
        var chance = 1 / 4

        return await battle(msg, args.slice(1).join(' '), action, damage, chance)
    },
    help: {
        name: 'slam <subject>',
        value: 'Slam something! Has a high chance of missing.'
    },
    type: 'Battling'
}