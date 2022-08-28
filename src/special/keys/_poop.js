module.exports = {
    desc: 'Returns a random Poopy funny.', func: function (msg) {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.poopPhrases[Math.floor(Math.random() * arrays.poopPhrases.length)]
            .replace(/{fart}/, Math.floor(Math.random() * 291) + 10)
            .replace(/{seconds}/, Math.floor((Math.random() * 59) + 2))
            .replace(/{mention}/, `<@${msg.author.id}>`)
    }
}