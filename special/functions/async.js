module.exports = {
  helpf: '(phrase)',
  desc: "Executes the keywords inside the function asynchronously.",
  func: async function (matches, msg, isBot) {
    let poopy = this

    var word = matches[1]
    poopy.functions.getKeywordsFor(word, msg, isBot).catch(() => { })
    return ''
  },
  raw: true
}