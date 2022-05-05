module.exports = {
  helpf: '(number1 | number2)',
  desc: 'Returns true if number1 is smaller than number2.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var number1 = Number(split[0])
    var number2 = Number(split.slice(1).join('|'))
    return number1 < number2 ? 'true' : ''
  }
}