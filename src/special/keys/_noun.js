module.exports = {
    desc: 'Returns a random noun.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var nounJSON = json.nounJSON
        return nounJSON.data[Math.floor(Math.random() * nounJSON.data.length)].noun
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var nounJSON = json.nounJSON
        return nounJSON.data.map(n => n.noun)
    }
}