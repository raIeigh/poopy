module.exports = {
  helpf: '(phrase1 | phrase2)',
  desc: 'Checks the similarity between the 2 phrases.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var phrase1 = split[0] ?? ''
    var phrase2 = split[1] ?? ''

    return poopy.functions.similarity(phrase1, phrase2)
  }
}