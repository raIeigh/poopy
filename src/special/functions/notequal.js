module.exports = {
  helpf: '(phrase1 | phrase2)',
  desc: 'Returns true if phrase1 is not equal to phrase2.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var phrase1 = split[0] ?? ''
    var phrase2 = split[1] ?? ''
    return phrase1 !== phrase2 ? 'true' : ''
  }
}