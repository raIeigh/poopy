module.exports = {
    name: ['slap'],
    args: [{
        "name": "subject", "required": true, "specifarg": false, "orig": "<subject>",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data.guildData[interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        let { battle } = poopy.functions
        var action = '**{src}** slapped **{trgt}**! It did **{dmg}** damage!'
        var damage = 5
        var chance = 3 / 4

        return await battle(msg, args.slice(1).join(' '), action, damage, chance)
    },
    help: {
        name: 'slap <subject>',
        value: 'Slap something! Has a small chance of missing.'
    },
    type: 'Battling'
}