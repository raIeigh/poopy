module.exports = {
  helpf: '(condition | function)',
  desc: "Repeats the function while the condition is met.",
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var condition = split[0] ?? ''
    var func = split[1] ?? ''
    while (await poopy.functions.getKeywordsFor(condition, msg, isBot, opts).catch(() => { }) ?? '') {
      await poopy.functions.getKeywordsFor(func, msg, isBot, opts).catch(() => { })
      poopy.tempdata[msg.author.id][msg.id]['keyattempts']++
      if (poopy.tempdata[msg.author.id][msg.id]['keyattempts'] >= poopy.config.keyLimit) break
    }
    return ''
  },
  raw: true,
  limit: 5
}