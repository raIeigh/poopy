module.exports = {
    desc: 'Returns a random country code.', func: async function () {
        let poopy = this

        var countryJSON = poopy.json.countryJSON
        var countryCodes = Object.keys(countryJSON)
        return countryCodes[Math.floor(Math.random() * countryCodes.length)]
    }
}