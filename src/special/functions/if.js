module.exports = {
  helpf: '(condition | phrase | elsePhrase)',
  desc: 'Returns the phrase if the specified condition is not blank, or else it returns the elsePhrase, if it exists.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { splitKeyFunc, getKeywordsFor } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var condition = await getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { })
    var phrase = split[1] ?? ''
    var elsephrase = split[2] ?? ''
    return condition ? phrase : elsephrase
  },
  raw: true
}