module.exports = {
    name: ['punch'],
    args: [{
        "name": "subject", "required": true, "specifarg": false, "orig": "<subject>",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data['guild-data'][interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return { name: memberData[id].username, value: id }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        let { battle } = poopy.functions
        var action = '**{src}** punched **{trgt}**! It did **{dmg}** damage!'
        var damage = 10
        var chance = 1 / 2

        await battle(msg, args.slice(1).join(' '), action, damage, chance)
    },
    help: { name: 'punch <subject>', value: 'Punch something!' },
    type: 'Battling'
}