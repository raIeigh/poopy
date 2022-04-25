module.exports = {
    desc: "Returns the channel's name.", func: async function (msg) {
        let poopy = this

        return msg.channel.name
    }
}