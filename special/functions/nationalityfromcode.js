module.exports = {
  helpf: '(countrycode)',
  desc: 'Returns a random nationality from the country that matches the country code.',
  func: function (matches) {
    let poopy = this
    let json = poopy.json

    var word = matches[1]

    var countryJSON = json.countryJSON
    var languageJSON = json.languageJSON

    return countryJSON[word.toUpperCase()] ? languageJSON[countryJSON[word.toUpperCase()].languages[Math.floor(Math.random() * countryJSON[word.toUpperCase()].languages.length)]].name : ''
  }
}