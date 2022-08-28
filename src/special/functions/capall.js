module.exports = {
  helpf: '(phrase)',
  desc: 'Makes Every Word In The Phrase Inside The Function Start With A Capital',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    var words = word.split(' ')
    for (var i in words) {
      var w = words[i]
      words[i] = w.substring(0, 1).toUpperCase() + w.substring(1, w.length)
    }
    return words.join(' ')
  }
}