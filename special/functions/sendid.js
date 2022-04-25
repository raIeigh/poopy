module.exports = {
    helpf: '(phrase)',
    desc: 'Sends a message to the channel. After being sent, it returns its ID. Has the default cooldown of course.',
    func: async (matches, msg) => {
        let poopy = this

        var word = matches[1]

        if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return ''
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0) {
                return `Calm down! Wait more ${(poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + 2500 / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) ? 5 : 1)

        var message = await msg.channel.send({
            content: word,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })

        if (message) {
            return message.id
        }

        return ''
    },
    attemptvalue: 10
}