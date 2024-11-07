module.exports = {
    desc: 'Returns your global name.', func: function (msg) {
        let poopy = this

        return msg.author.globalName
    }
}