module.exports = {
    desc: 'Returns your own username.', func: async function (msg) {
        let poopy = this

        return msg.author.username
    }
}