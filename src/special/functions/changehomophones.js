module.exports = {
    helpf: '(phrase)',
    desc: 'Replaces homophones in the phrase with randomly selected ones.',
    func: function (matches) {
        let poopy = this
        let json = poopy.json

        var word = matches[1]
        var phoneJSON = json.homophoneJSON
        var words = word.split(' ')
        for (var i in words) {
            var word = words[i]
            var homophones = phoneJSON[word.toLowerCase()]
            if (!homophones) continue
            var homophone = homophones[Math.floor(Math.random() * homophones.length)]
            if (homophone) words[i] = (word.substring(0, 1) === word.substring(0, 1).toLowerCase()) ? homophone :
                ((word.substring(0, 2) === (word.substring(0, 1).toUpperCase() + word.substring(1, 2).toLowerCase())) ? homophone.substring(0, 1).toUpperCase() + homophone.substring(1).toLowerCase() :
                homophone.toUpperCase())
        }
        return words.join(' ')
    }
}