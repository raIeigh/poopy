module.exports = {
    desc: 'Returns a random city.', func: async function () {
        let poopy = this

        var cityJSON = poopy.json.cityJSON
        return cityJSON[Math.floor(Math.random() * cityJSON.length)].name
    }
}