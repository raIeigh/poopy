module.exports = {
    helpf: '(countrycode)',
    desc: 'Returns a random city from the country that matches the country code.',
    func: async function (matches) {
        let poopy = this

        var word = matches[1]

        var countryJSON = poopy.json.countryJSON
        var cityJSON = poopy.json.cityJSON

        if (countryJSON[word.toUpperCase()]) {
            var cities = []

            for (var i in cityJSON) {
                var city = cityJSON[i]
                if (city.country === word.toUpperCase()) {
                    cities.push(city.name)
                }
            }

            return cities[Math.floor(Math.random() * cities.length)]
        }

        return ''
    }
}