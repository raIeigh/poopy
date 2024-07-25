module.exports = {
    desc: 'Returns a random DM phrase.',
    func: function (msg) {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.dmPhrases[Math.floor(Math.random() * arrays.dmPhrases.length)]
            .replace(/{mention}/, `<@${msg.author.id}>`)
    },
    array: function (msg) {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.dmPhrases.map(dm => dm.replace(/{mention}/, `<@${msg.author.id}>`))
    }
}