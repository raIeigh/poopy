module.exports = {
  helpf: '(phrase | times | separator)',
  desc: "Repeats the phrase by the times specified. If the separator is specified, it'll separate each repetition with the separator.",
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var phrase = split[0] ?? ''
    var times = Math.min(Number(split[1] ?? ''), 100)
    var separator = split.slice(2).length ? split.slice(2).join('|') : ''
    var repeat = []
    for (var i = 0; i < times; i++) {
      repeat.push(phrase)
      poopy.tempdata[msg.author.id]['keyattempts']++
      if (poopy.tempdata[msg.author.id]['keyattempts'] >= poopy.config.keyLimit) break
    }
    return repeat.join(separator)
  }
}