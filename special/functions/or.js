module.exports = {
  helpf: '(phrase1 | phrase2 | phrase3 | etc...)',
  desc: "Returns the first phrase that isn't blank.",
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var or = ''
    for (var i in split) {
      var phrase = split[i]
      if (phrase) return phrase
    }
    return ''
  }
}