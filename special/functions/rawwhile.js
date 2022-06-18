module.exports = {
  helpf: '(condition | phrase | separator)',
  desc: "Repeats the phrase while the condition is met, except keywords and functions aren't automatically executed. If the separator is specified, it'll separate each repetition with the separator.",
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 3 })
    var condition = split[0] ?? ''
    var phrase = split[1] ?? ''
    var separator = await poopy.functions.getKeywordsFor(split[2] ?? '', msg, isBot).catch(() => { }) ?? ''
    var repeat = []
    while (await poopy.functions.getKeywordsFor(condition, msg, isBot).catch(() => { }) ?? '') {
      repeat.push(phrase)
      poopy.tempdata[msg.author.id][msg.id]['keyattempts']++
      if (poopy.tempdata[msg.author.id][msg.id]['keyattempts'] >= poopy.config.keyLimit) break
    }
    return repeat.join(separator)
  },
  raw: true,
  limit: 5
}