module.exports = {
  helpf: '(phrase1 | phrase2)',
  desc: 'Checks the similarity between the 2 phrases.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc, similarity } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var phrase1 = split[0] ?? ''
    var phrase2 = split[1] ?? ''

    return similarity(phrase1, phrase2)
  }
}