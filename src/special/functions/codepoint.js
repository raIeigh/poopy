module.exports = {
  helpf: '(integer)',
  desc: 'Returns the Unicode character at the codepoint specified.',
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    return String.fromCodePoint(Math.round(Number(word)))
  }
}