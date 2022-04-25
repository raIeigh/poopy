module.exports = {
    desc: 'Returns your own id.', func: async (msg) => {
        let poopy = this

        return msg.author.id
    }
}