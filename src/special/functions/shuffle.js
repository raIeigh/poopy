module.exports = {
    helpf: '(phrase)',
    desc: 'teh ltteres fo het parhse crSabmles hte cfuti.non siinde',
    func: function (matches) {
        let poopy = this

        var word = matches[1]
        var letters = word.split('')
        var shuffled = []
        var shuffled2 = []
        for (var i in letters) {
            var l = letters[i]
            shuffled.push({ letter: l, randomness: Math.random() })
        }
        shuffled.sort(function (a, b) {
            return a.randomness - b.randomness
        })
        for (var i in shuffled) {
            var letter = shuffled[i]
            shuffled2.push(letter.letter)
        }
        return shuffled2.join('')
    }
}