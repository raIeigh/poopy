module.exports = {
    helpf: '(phrase)',
    desc: 'the phrase Scrambles the function. inside',
    func: async function (matches) {
        let poopy = this

        var word = matches[1]
        var words = word.split(' ')
        var scrambled = []
        var scrambled2 = []
        for (var i in words) {
            var w = words[i]
            scrambled.push({ word: w, randomness: Math.random() })
        }
        scrambled.sort(function (a, b) {
            return a.randomness - b.randomness
        })
        for (var i in scrambled) {
            var word = scrambled[i]
            scrambled2.push(word.word)
        }
        return scrambled2.join(' ')
    }
}