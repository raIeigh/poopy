module.exports = {
    name: ['toggledms', 'tdms'],
    execute: async function (msg) {
        let poopy = this

        if (!poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id] = {}
        }
        if (poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['dms'] === undefined) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['dms'] = false
        }
        if (poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['dms'] === false) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['dms'] = true
            msg.channel.send({
                content: 'Unrelated DMs from `dm` will **be sent** to you now.',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        } else {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['dms'] = false
            msg.channel.send({
                content: 'Unrelated DMs from `dm` will **not be sent** to you now.',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
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