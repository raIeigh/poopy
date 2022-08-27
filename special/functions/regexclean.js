module.exports = {
  helpf: '(phrase)',
  desc: 'Cleans the content in the phrase so it can be used in match functions without triggering anything from the cheatsheet.',
  func: function (matches) {
    let poopy = this
    let { regexClean } = poopy.functions

    var word = matches[1]
    return regexClean(word)
  }
}