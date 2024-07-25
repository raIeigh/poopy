module.exports = {
  helpf: '(phrase)',
  desc: 'Returns the opposite of the phrase.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    return !word ? 'true' : ''
  }
}