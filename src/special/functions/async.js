module.exports = {
  helpf: '(phrase)',
  desc: "Executes the keywords inside the function asynchronously.",
  func: function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { getKeywordsFor, deleteMsgData } = poopy.functions

    var word = matches[1]
    getKeywordsFor(word, msg, isBot, opts)
        .then(() => deleteMsgData(msg)).catch(() => { })
    return ''
  },
  raw: true
}