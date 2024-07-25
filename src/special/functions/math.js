module.exports = {
  helpf: '(expression)',
  desc: 'Evaluates the specified math expression if it is valid.',
  func: function (matches) {
    let poopy = this
    let { mathjs } = poopy.modules

    var word = matches[1]
    try {
      return String(mathjs.evaluate(word))
    } catch (err) {
      return 'NaN'
    }
  },
  parentheses: true
}