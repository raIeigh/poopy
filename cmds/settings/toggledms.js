module.exports = {
    name: ['toggledms', 'tdms'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let data = poopy.data

        if (!data['user-data'][msg.author.id]) {
            data['user-data'][msg.author.id] = {}
        }
        if (data['user-data'][msg.author.id]['dms'] === undefined) {
            data['user-data'][msg.author.id]['dms'] = false
        }
        if (data['user-data'][msg.author.id]['dms'] === false) {
            data['user-data'][msg.author.id]['dms'] = true
            await msg.reply({
                content: 'Unrelated DMs from `dm` will **be sent** to you now.',
                allowedMentions: {
                    parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        } else {
            data['user-data'][msg.author.id]['dms'] = false
            await msg.reply({
                content: 'Unrelated DMs from `dm` will **not be sent** to you now.',
                allowedMentions: {
                    parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
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