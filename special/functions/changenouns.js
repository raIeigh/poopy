module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the nouns in the phrase with different ones.',
    func: async (matches) => {
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
            if (words[i].match(nounRegex)) words[i] = words[i].replace(nounRegex, (word) => {
                var noun = nouns[Math.floor(Math.random() * nouns.length)]
                if (word.substring(0, 1) === word.substring(0, 1).toLowerCase()) return noun
                else if (word.substring(0, 2) === (word.substring(0, 1).toUpperCase() + word.substring(1, 2).toLowerCase())) return noun.substring(0, 1).toUpperCase() + noun.substring(1).toLowerCase()
                else return noun.toUpperCase()
            })
        }
        return words.join(' ')
    }
}