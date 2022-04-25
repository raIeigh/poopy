module.exports = {
    helpf: '(id)',
    desc: 'Deletes the message. If the ID is specified, the message must be sent by Poopy less than a minute ago.',
    func: async (matches, msg) => {
        let poopy = this

        var word = matches[1]
        var id = word || msg.id
        var messageToDelete = word ? await msg.channel.messages.fetch(id).catch(() => { }) : msg

        if (messageToDelete) {
            if ((messageToDelete.author.id !== poopy.bot.user.id && messageToDelete.id !== id) || (Date.now() - messageToDelete.createdTimestamp) > 60000) {
                return ''
            }

            await messageToDelete.delete().catch(() => { })
        }

        return ''
    }
}