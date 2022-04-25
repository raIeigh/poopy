module.exports = {
  helpf: '(expression)',
  desc: 'Evaluates the specified math expression if it is valid.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    try {
      return String(poopy.modules.mathjs.evaluate(word))
    } catch (err) {
      return 'NaN'
    }
  },
  parentheses: true
}