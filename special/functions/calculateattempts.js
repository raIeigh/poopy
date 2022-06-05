module.exports = {
    helpf: '(phrase)',
    desc: 'Calculates the attempts needed to execute everything inside the function.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var word = matches[1]
        var currentAttempts = poopy.tempdata[msg.author.id]['keyattempts']

        await poopy.functions.getKeywordsFor(word, msg, isBot, opts).catch(() => { })

        return poopy.tempdata[msg.author.id]['keyattempts'] - currentAttempts
    },
    raw: true
}