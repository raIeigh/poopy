module.exports = {
    desc: 'Returns your own username.', func: function (msg) {
        let poopy = this

        return msg.author.username
    }
}