module.exports = {
    desc: 'Returns a random country.', func: function () {
        let poopy = this
        let json = poopy.json

        var countryJSON = json.countryJSON
        var countryCodes = Object.keys(countryJSON)
        return countryJSON[countryCodes[Math.floor(Math.random() * countryCodes.length)]].name
    }
}