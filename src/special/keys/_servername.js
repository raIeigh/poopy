module.exports = {
    desc: "Returns the server's name.", func: function (msg) {
        let poopy = this

        return msg.guild.name
    }
}