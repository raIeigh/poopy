module.exports = {
    desc: 'Returns your own id.', func: function (msg) {
        let poopy = this

        return msg.author.id
    }
}