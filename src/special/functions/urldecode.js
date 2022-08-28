module.exports = {
  helpf: '(phrase)',
  desc: "Decodes the phrase so it's just a normal string.",
  func: function (matches) {
    let poopy = this

    var word = matches[1]
    return decodeURIComponent(word)
  }
}