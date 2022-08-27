module.exports = {
    desc: 'Returns a random nationality.', func: function () {
        let poopy = this
        let json = poopy.json

        var languageJSON = json.languageJSON
        var languageCodes = Object.keys(languageJSON)
        return languageJSON[languageCodes[Math.floor(Math.random() * languageCodes.length)]].name
    }
}