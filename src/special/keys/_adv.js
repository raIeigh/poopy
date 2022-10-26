module.exports = {
    desc: 'Returns a random adverb.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var advJSON = json.advJSON
        return advJSON.data[Math.floor(Math.random() * advJSON.data.length)]
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var advJSON = json.advJSON
        return advJSON.data
    }
}