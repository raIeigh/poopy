module.exports = {
  helpf: '(countrycode)',
  desc: 'Returns a random nationality from the country that matches the country code.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]

    var countryJSON = poopy.json.countryJSON
    var languageJSON = poopy.json.languageJSON

    return countryJSON[word.toUpperCase()] ? languageJSON[countryJSON[word.toUpperCase()].languages[Math.floor(Math.random() * countryJSON[word.toUpperCase()].languages.length)]].name : ''
  }
}