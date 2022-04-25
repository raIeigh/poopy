module.exports = {
  helpf: '(phrase)',
  desc: 'makes the phrase all lowercase.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    return word.toLowerCase()
  }
}