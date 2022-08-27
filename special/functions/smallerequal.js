module.exports = {
  helpf: '(number1 | number2)',
  desc: 'Returns true if number1 is smaller or equal to number2.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word)
    var number1 = Number(split[0])
    var number2 = Number(split.slice(1).join('|'))
    return number1 <= number2 ? 'true' : ''
  }
}