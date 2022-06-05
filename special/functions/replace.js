module.exports = {
  helpf: '(phrase | replacement | regexp)',
  desc: 'Replaces everything in the phrase that matches the RegExp with the new replacement.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var phrase = split[0] ?? ''
    var replacement = split[1] ?? ''
    var reg = split.slice(2).length ? split.slice(2).join('|') : ''
    var regexp = new RegExp(reg, 'ig')
    return phrase.replace(regexp, replacement)
  }
}