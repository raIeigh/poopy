module.exports = {
  helpf: '(phrase)',
  desc: 'Makes the phrase inside the function start with a capital.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    return word.substring(0, 1).toUpperCase() + word.substring(1, word.length)
  }
}