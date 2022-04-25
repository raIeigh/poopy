module.exports = {
    desc: 'Returns your own id.', func: async function (msg) {
        let poopy = this

        return msg.author.id
    }
}