module.exports = {
  helpf: '(phrase1 | phrase2)',
  desc: 'Returns true if phrase1 is equal to phrase2.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var phrase1 = split[0] ?? ''
    var phrase2 = split.slice(1).length ? split.slice(1).join(' | ') : ''
    return phrase1 === phrase2 ? 'true' : ''
  }
}