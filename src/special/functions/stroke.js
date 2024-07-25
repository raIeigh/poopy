module.exports = {
  helpf: '(phrase)',
  desc: 'ion into a stroke.  thnernn rhr rie tiaotsee pec',
  func: function (matches) {
    let poopy = this
    let { gibberish } = poopy.functions

    var word = matches[1]
    return gibberish(word)
  }
}