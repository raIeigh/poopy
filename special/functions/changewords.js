module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the words in the phrase with different ones.',
    func: async function (matches) {
        let poopy = this

        var word = matches[1]
        var wrdJSON = poopy.json.wordJSON
        var wrds = []
        var wrdsR = []
        for (var i in wrdJSON.data) {
            var wrd = wrdJSON.data[i]
            wrds.push(wrd.word.value)
            wrdsR.push('^' + wrd.word.value)
        }
        var wrdRegex = new RegExp(`${wrdsR.join('|')}`, 'i')
        var words = word.split(' ')
        for (var i in words) {
            if (words[i].match(wrdRegex)) words[i] = words[i].replace(wrdRegex, (word) => {
                var wrd = wrds[Math.floor(Math.random() * wrds.length)]
                if (word.substring(0, 1) === word.substring(0, 1).toLowerCase()) return wrd
                else if (word.substring(0, 2) === (word.substring(0, 1).toUpperCase() + word.substring(1, 2).toLowerCase())) return wrd.substring(0, 1).toUpperCase() + wrd.substring(1).toLowerCase()
                else return wrd.toUpperCase()
            })
        }
        return words.join(' ')
    }
}