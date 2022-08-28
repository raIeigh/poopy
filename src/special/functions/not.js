module.exports = {
  helpf: '(phrase)',
  desc: 'Returns the opposite of the phrase.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word)
    var phrase = split.slice(0).length ? split.slice(0).join(' | ') : ''
    return !phrase ? 'true' : ''
  }
}