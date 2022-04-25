module.exports = {
  helpf: '(phrase)',
  desc: 'Returns the length of the phrase.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    return word.length
  }
}