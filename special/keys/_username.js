module.exports = {
    desc: 'Returns your own username.', func: async (msg) => {
        let poopy = this

        return msg.author.username
    }
}