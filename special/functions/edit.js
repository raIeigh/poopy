module.exports = {
    helpf: '(id | phrase) (manage messages only)',
    desc: 'Edits a message sent by Poopy.',
    func: async function (matches, msg, isBot) {
        let poopy = this
        let { splitKeyFunc } = poopy.functions
        let config = poopy.config
        let bot = poopy.bot

        var word = matches[1]
        var split = splitKeyFunc(word)
        var id = split[0] ?? ''
        var phrase = split.slice(1).length ? split.slice(1).join(' | ') : ''

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id) || isBot) {
            var messageToEdit = await msg.channel.messages.fetch(id).catch(() => { })

            if (messageToEdit) {
                if (messageToEdit.author.id !== bot.user.id) {
                    return ''
                }

                await messageToEdit.edit({
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    },
                    content: phrase
                }).catch(() => { })
            }
        } else {
            return 'You need to have the manage messages permission to execute that!'
        }

        return ''
    }
}