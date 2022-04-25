module.exports = {
    desc: "Returns the server's name.", func: async (msg) => {
        let poopy = this

        return msg.guild.name
    }
}