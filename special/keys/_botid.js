module.exports = {
    desc: 'Returns the bot\'s user id.', func: function () {
        let poopy = this

        return poopy.bot.user.id
    }
}