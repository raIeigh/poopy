module.exports = {
    desc: 'Returns a random continent.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var continentJSON = json.continentJSON
        var continentCodes = Object.keys(continentJSON)
        return continentJSON[continentCodes[Math.floor(Math.random() * continentCodes.length)]]
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var continentJSON = json.continentJSON
        return Object.values(continentJSON)
    }
}