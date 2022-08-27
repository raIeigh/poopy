module.exports = {
  helpf: '(city)',
  desc: 'Returns the longitude of the city specified.',
  func: function (matches) {
    let poopy = this
    let json = poopy.json

    var word = matches[1]

    var cityJSON = json.cityJSON

    return cityJSON.find(city => city.name.toLowerCase() === word.toLowerCase()) ? cityJSON.find(city => city.name.toLowerCase() === word.toLowerCase()).lng : '0'
  }
}