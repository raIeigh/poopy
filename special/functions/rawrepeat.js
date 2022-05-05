module.exports = {
  helpf: '(phrase | times | separator)',
  desc: "Repeats the phrase by the times specified, but keywords and functions don't execute automatically. If the separator is specified, it'll separate each repetition with the separator.",
  func: async function (matches, msg, isBot) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var times = Math.min(Number(await poopy.functions.getKeywordsFor(split[1] ?? '', msg, isBot).catch(() => { })), 2000) ?? 1
    var separator = await poopy.functions.getKeywordsFor(split[2] ?? '', msg, isBot).catch(() => { }) ?? ''
    var repeat = []
    for (var i = 0; i < times; i++) {
      repeat.push(await poopy.functions.getKeywordsFor(phrase, msg, isBot).catch(() => { }) ?? '')
    }
    return repeat.join(separator).substring(0, 2000)
  },
  raw: true,
  attemptvalue: 10
}