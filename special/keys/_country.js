module.exports = {
    desc: 'Returns a random country.', func: async function () {
        let poopy = this

        var countryJSON = poopy.json.countryJSON
        var countryCodes = Object.keys(countryJSON)
        return countryJSON[countryCodes[Math.floor(Math.random() * countryCodes.length)]].name
    }
}