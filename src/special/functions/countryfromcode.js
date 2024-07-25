module.exports = {
  helpf: '(countrycode)',
  desc: 'Returns the name of the country that matches the country code.',
  func: function (matches) {
    let poopy = this
    let json = poopy.json

    var word = matches[1]

    var countryJSON = json.countryJSON

    return countryJSON[word.toUpperCase()] ? countryJSON[word.toUpperCase()].name : ''
  }
}