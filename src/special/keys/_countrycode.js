module.exports = {
    desc: 'Returns a random country code.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var countryJSON = json.countryJSON
        var countryCodes = Object.keys(countryJSON)
        return countryCodes[Math.floor(Math.random() * countryCodes.length)]
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var countryJSON = json.countryJSON
        return Object.keys(countryJSON)
    }
}