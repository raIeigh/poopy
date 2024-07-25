module.exports = {
    desc: 'Returns a random server emoji.',
    func: function (msg) {
        let poopy = this
        let { randomChoice } = poopy.functions

        return randomChoice([...msg.guild.emojis.cache.values()]).toString()
    },
    array: function (msg) {
        let poopy = this

        return [...msg.guild.emojis.cache.values()].map(e => e.toString())
    }
}