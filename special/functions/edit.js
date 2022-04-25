module.exports = {
    helpf: '(id | phrase)',
    desc: 'Edits a message sent by Poopy less than a minute ago.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word)
        var id = split[0] ?? ''
        var phrase = split.slice(1).length ? split.slice(1).join(' | ') : ''

        var messageToEdit = await msg.channel.messages.fetch(id).catch(() => { })

        if (messageToEdit) {
            if (messageToEdit.author.id !== poopy.bot.user.id || (Date.now() - messageToEdit.createdTimestamp) > 60000) {
                return ''
            }

            await messageToEdit.edit({
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                },
                content: phrase
            }).catch(() => { })
        }

        return ''
    }
}