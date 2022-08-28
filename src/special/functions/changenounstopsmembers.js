module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the nouns in the phrase with Phexonia Studios members.',
    func: async function (matches) {
        let poopy = this
        let json = poopy.json
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
            if (words[i].match(nounRegex)) words[i] = await words[i].replace(nounRegex, (word) => {
                var psmember = special.keys._psmember.func.call(poopy)
                if (word.substring(0, 1) === word.substring(0, 1).toLowerCase()) return psmember
                else if (word.substring(0, 2) === (word.substring(0, 1).toUpperCase() + word.substring(1, 2).toLowerCase())) return psmember.substring(0, 1).toUpperCase() + psmember.substring(1).toLowerCase()
                else return psmember.toUpperCase()
            })
        }
        return words.join(' ')
    }
}