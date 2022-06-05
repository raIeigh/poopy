module.exports = {
  helpf: '(min | max)',
  desc: 'Returns a random number between min and max. They should be separated by "|".',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    if (split.length <= 1 && split[0] === '') return Math.random()
    var min = Math.round(Number(split[0])) || 0
    var max = Math.round(Number(split[split.length - 1])) || 0
    return Math.floor(Math.random() * (max + 1 - min)) + min
  }
}