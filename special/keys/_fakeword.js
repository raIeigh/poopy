module.exports = {
    desc: 'Returns a random fake word.', func: function () {
        let poopy = this

        var fakeWordJSON = poopy.json.fakeWordJSON
        return fakeWordJSON.data[Math.floor(Math.random() * fakeWordJSON.data.length)].word
    }
}