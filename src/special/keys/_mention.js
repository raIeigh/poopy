module.exports = {
    desc: "Returns whether the bot has been mentioned in the message or not.", func: async function (msg) {
        let poopy = this
        let bot = poopy.bot

        return !!msg.mentions.members.find(member => member.user.id === bot.user.id) || ''
    }
}