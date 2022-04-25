module.exports = {
    desc: "Returns the channel's id.", func: async function (msg) {
        let poopy = this

        return msg.channel.id
    }
}