module.exports = {
  helpf: '(phrase)',
  desc: 'MAKES THE PHRASE ALL UPPERCASE!',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    return word.toUpperCase()
  }
}