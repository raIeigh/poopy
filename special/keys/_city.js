module.exports = {
    desc: 'Returns a random city.', func: function () {
        let poopy = this
        let json = poopy.json

        var cityJSON = json.cityJSON
        return cityJSON[Math.floor(Math.random() * cityJSON.length)].name
    }
}