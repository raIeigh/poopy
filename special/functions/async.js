module.exports = {
  helpf: '(phrase)',
  desc: "Executes the keywords inside the function asynchronously.",
  func: function (matches, msg, isBot, _, opts) {
    let poopy = this

    var word = matches[1]
    poopy.functions.getKeywordsFor(word, msg, isBot, opts).catch(() => { })
    return ''
  },
  raw: true
}