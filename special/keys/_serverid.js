module.exports = {
    desc: "Returns the server's id.", func: async (msg) => {
        let poopy = this

        return msg.guild.id
    }
}