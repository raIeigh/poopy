module.exports = {
    desc: "Returns the channel's name.", func: function (msg) {
        let poopy = this

        return msg.channel.name
    }
}