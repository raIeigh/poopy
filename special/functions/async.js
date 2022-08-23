module.exports = {
  helpf: '(phrase)',
  desc: "Executes the keywords inside the function asynchronously.",
  func: function (matches, msg, isBot, _, opts) {
    let poopy = this

    var word = matches[1]
    poopy.functions.getKeywordsFor(word, msg, isBot, opts)
        .then(() => poopy.functions.deleteMsgData(msg)).catch(() => { })
    return ''
  },
  raw: true
}