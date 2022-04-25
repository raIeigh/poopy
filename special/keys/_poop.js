module.exports = {
    desc: 'Returns a random Poopy funny.', func: async (msg) => {
        let poopy = this

        return poopy.arrays.poopPhrases[Math.floor(Math.random() * poopy.arrays.poopPhrases.length)]
            .replace(/{fart}/, Math.floor(Math.random() * 291) + 10)
            .replace(/{seconds}/, Math.floor((Math.random() * 59) + 2))
            .replace(/{mention}/, `<@${msg.author.id}>`)
    }
}