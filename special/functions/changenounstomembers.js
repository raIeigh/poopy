module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the nouns in the phrase with members.',
    func: async function (matches, msg) {
        let poopy = this
        let json = poopy.json
        let { replaceAsync } = poopy.functions
        let special = poopy.special

        var word = matches[1]
        var nounJSON = json.nounJSON
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
            if (words[i].match(nounRegex)) words[i] = replaceAsync(words[i], nounRegex, async (word) => {
                var member = await special.keys._member.func(msg)
                if (word === word.toUpperCase()) return member.toUpperCase()
                else return member
            })
        }
        return words.join(' ')
    }
}