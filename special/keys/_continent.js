module.exports = {
    desc: 'Returns a random continent.', func: function () {
        let poopy = this

        var continentJSON = poopy.json.continentJSON
        var continentCodes = Object.keys(continentJSON)
        return continentJSON[continentCodes[Math.floor(Math.random() * continentCodes.length)]]
    }
}