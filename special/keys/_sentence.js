module.exports = {
    desc: 'Returns a random sentence.', func: async function () {
        let poopy = this

        var sentenceJSON = poopy.json.sentenceJSON
        return sentenceJSON.data[Math.floor(Math.random() * sentenceJSON.data.length)].sentence
    }
}