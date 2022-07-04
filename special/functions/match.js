module.exports = {
  helpf: '(phrase | regexp)',
  desc: 'Matches the content in the phrase with the RegExp.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var phrase = split[0] ?? ''
    var reg = split[1] ?? ''
    var regexp = new RegExp(reg, 'i')
    var match = phrase.match(regexp) ?? []
    return match[0] ?? ''
  }
}