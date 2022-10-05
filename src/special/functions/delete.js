module.exports = {
    helpf: '(id) (manage messages only)',
    desc: 'Deletes the message.',
    func: async function (matches, msg, isBot) {
        let poopy = this
        let config = poopy.config

        var word = matches[1]
        var id = word || msg.id

        if (msg.member.permissions.has('ManageGuild') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id) || isBot) {
            var messageToDelete = word ? await msg.channel.messages.fetch(id).catch(() => { }) : msg

            if (messageToDelete) {
                await messageToDelete.delete().catch(() => { })
            }
        } else {
            return 'You need to have the manage messages permission to execute that!'
        }

        return ''
    }
}