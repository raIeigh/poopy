module.exports = {
    desc: 'Returns a random fake word.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var fakeWordJSON = json.fakeWordJSON
        return fakeWordJSON.data[Math.floor(Math.random() * fakeWordJSON.data.length)].word
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var fakeWordJSON = json.fakeWordJSON
        return fakeWordJSON.data.map(f => f.word)
    }
}