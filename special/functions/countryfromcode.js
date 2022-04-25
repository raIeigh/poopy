module.exports = {
  helpf: '(countrycode)',
  desc: 'Returns the name of the country that matches the country code.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]

    var countryJSON = poopy.json.countryJSON

    return countryJSON[word.toUpperCase()] ? countryJSON[word.toUpperCase()].name : ''
  }
}