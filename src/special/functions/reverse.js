module.exports = {
  helpf: '(phrase)',
  desc: 'Reverses the phrase inside the function.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]

    return Array.from(word).reverse().join('')
  }
}