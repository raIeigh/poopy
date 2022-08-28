module.exports = {
  helpf: '(phrase)',
  desc: 'Removes any spaces or breaks at the start or end of phrase.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    return word.trim()
  }
}