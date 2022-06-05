module.exports = {
    helpf: '(phrase)',
    desc: 'The markov chain generated AND THE Last Messages. turn on',
    func: function (matches, msg) {
        let poopy = this

        var word = matches[1]

        var messages = poopy.data['guild-data'][msg.guild.id]['messages'].slice().map(m => m.content)
        if (messages.length <= 0) {
            messages = poopy.json.sentenceJSON.data.map(s => s.sentence).concat(poopy.arrays.psPasta)
        }
        if (word) {
            messages.push(word)
        }
        var markovChain = poopy.functions.markovChainGenerator(messages.join('  '))
        var markov = poopy.functions.markovMe(markovChain, word)

        return markov
    }
}