module.exports = {
    name: ['toggledms', 'tdms'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let data = poopy.data

        if (!data.userData[msg.author.id]) {
            data.userData[msg.author.id] = {}
        }
        if (data.userData[msg.author.id]['dms'] === undefined) {
            data.userData[msg.author.id]['dms'] = false
        }
        if (data.userData[msg.author.id]['dms'] === false) {
            data.userData[msg.author.id]['dms'] = true
            await msg.reply({
                content: 'Unrelated DMs from `dm` will **be sent** to you now.',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        } else {
            data.userData[msg.author.id]['dms'] = false
            await msg.reply({
                content: 'Unrelated DMs from `dm` will **not be sent** to you now.',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        }
    },
    help: {
        name: 'toggledms/tdms',
        value: "Disables/enables Poopy's ability to send you DMs through the `dm` command."
    },
    cooldown: 2500,
    type: 'Settings'
}