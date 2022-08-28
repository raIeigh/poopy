module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the verbs in the phrase with different ones.',
    func: function (matches) {
        let poopy = this
        let json = poopy.json

        var word = matches[1]
        var verbJSON = json.verbJSON
        var verbs = []
        var verbsR = []
        for (var i in verbJSON.data) {
            var verb = verbJSON.data[i]
            verbs.push(verb.verb)
            verbsR.push('^' + verb.verb)
        }
        var verbRegex = new RegExp(`${verbsR.join('|')}`, 'i')
        var words = word.split(' ')
        for (var i in words) {
            if (words[i].match(verbRegex)) words[i] = words[i].replace(verbRegex, (word) => {
                var verb = verbs[Math.floor(Math.random() * verbs.length)]
                if (word.substring(0, 1) === word.substring(0, 1).toLowerCase()) return verb
                else if (word.substring(0, 2) === (word.substring(0, 1).toUpperCase() + word.substring(1, 2).toLowerCase())) return verb.substring(0, 1).toUpperCase() + verb.substring(1).toLowerCase()
                else return verb.toUpperCase()
            })
        }
        return words.join(' ')
    }
}