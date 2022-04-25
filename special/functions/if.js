module.exports = {
  helpf: '(condition | phrase | elsePhrase)',
  desc: 'Returns the phrase if the specified condition is not blank, or else it returns the elsePhrase, if it exists.',
  func: async (matches, msg, isBot) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var condition = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { })
    var phrase = split[1] ?? ''
    var elsephrase = split.slice(2).length ? split.slice(2).join(' | ') : ''
    return condition ? phrase : elsephrase
  },
  raw: true
}