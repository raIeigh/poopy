module.exports = {
    desc: 'Returns a random sentence.', func: function () {
        let poopy = this
        let json = poopy.json

        var sentenceJSON = json.sentenceJSON
        return sentenceJSON.data[Math.floor(Math.random() * sentenceJSON.data.length)].sentence
    }
}