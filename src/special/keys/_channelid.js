module.exports = {
    desc: "Returns the channel's id.", func: function (msg) {
        let poopy = this

        return msg.channel.id
    }
}