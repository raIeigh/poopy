module.exports = {
  helpf: '(phrase)',
  desc: 'Returns the opposite of the phrase.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var phrase = split.slice(0).length ? split.slice(0).join(' | ') : ''
    return !phrase ? 'true' : ''
  }
}