module.exports = {
    helpf: '(randomSentences)',
    desc: 'The markov chain generated AND THE Last Messages. uses diffrent algorithm!',
    func: function (matches, msg) {
        let poopy = this

        var word = matches[1]

        var messages = poopy.data['guild-data'][msg.guild.id]['messages'].slice().map(m => m.content)
        if (messages.length <= 0 || word) {
            messages = poopy.json.sentenceJSON.data.map(s => s.sentence).concat(poopy.arrays.psPasta)
        }

        return poopy.functions.markov(messages)
    }
}