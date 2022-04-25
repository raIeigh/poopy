module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces all of the adjectives in the phrase with different ones.',
    func: async function (matches) {
        let poopy = this

        var word = matches[1]
        var adjJSON = poopy.json.adjJSON
        var adjs = []
        var adjsR = []
        for (var i in adjJSON.data) {
            var adj = adjJSON.data[i]
            adjs.push(adj.adjective)
            adjsR.push('^' + adj.adjective)
        }
        var adjRegex = new RegExp(`${adjsR.join('|')}`, 'i')
        var words = word.split(' ')
        for (var i in words) {
            if (words[i].match(adjRegex)) words[i] = words[i].replace(adjRegex, (word) => {
                var adj = adjs[Math.floor(Math.random() * adjs.length)]
                if (word.substring(0, 1) === word.substring(0, 1).toLowerCase()) return adj
                else if (word.substring(0, 2) === (word.substring(0, 1).toUpperCase() + word.substring(1, 2).toLowerCase())) return adj.substring(0, 1).toUpperCase() + adj.substring(1).toLowerCase()
                else return adj.toUpperCase()
            })
        }
        return words.join(' ')
    }
}