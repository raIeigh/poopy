module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the nouns in the phrase with members.',
    func: async (matches, msg) => {
        let poopy = this

        var word = matches[1]
        var nounJSON = poopy.json.nounJSON
        var nouns = []
        var nounsR = []
        for (var i in nounJSON.data) {
            var noun = nounJSON.data[i]
            nouns.push(noun.noun)
            nounsR.push('^' + noun.noun)
        }
        var nounRegex = new RegExp(`${nounsR.join('|')}`, 'i')
        var words = word.split(' ')
        for (var i in words) {
            if (words[i].match(nounRegex)) words[i] = poopy.functions.replaceAsync(words[i], nounRegex, async (word) => {
                var member = await poopy.specialkeys.keys._member.func(msg)
                if (word === word.toUpperCase()) return member.toUpperCase()
                else return member
            })
        }
        return words.join(' ')
    }
}