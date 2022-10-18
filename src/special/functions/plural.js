module.exports = {
  helpf: '(word)',
  desc: 'Converts the word inside to plural.',
  func: function (matches) {
    let poopy = this
    let { pluralize } = poopy.modules

    var word = matches[1]
    return pluralize.plural(word)
  }
}