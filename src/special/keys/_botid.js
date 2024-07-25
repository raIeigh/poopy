module.exports = {
    desc: 'Returns the bot\'s user id.', func: function () {
        let poopy = this
        let bot = poopy.bot

        return bot.user.id
    }
}