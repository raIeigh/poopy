module.exports = {
    desc: 'Returns a random word.', func: function () {
        let poopy = this
        let json = poopy.json

        var wordJSON = json.wordJSON
        return wordJSON.data[Math.floor(Math.random() * wordJSON.data.length)].word.value
    }
}