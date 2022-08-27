module.exports = {
  helpf: '(expression)',
  desc: 'Evaluates the specified math expression if it is valid.',
  func: function (matches) {
    let poopy = this
    let modules = poopy.modules

    var word = matches[1]
    try {
      return String(modules.mathjs.evaluate(word))
    } catch (err) {
      return 'NaN'
    }
  },
  parentheses: true
}