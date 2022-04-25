module.exports = {
  helpf: '(phrase)',
  desc: "Encodes the phrase so it's supported by URL components.",
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    return encodeURIComponent(word)
  }
}