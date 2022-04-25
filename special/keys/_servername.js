module.exports = {
    desc: "Returns the server's name.", func: async function (msg) {
        let poopy = this

        return msg.guild.name
    }
}