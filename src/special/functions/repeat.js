module.exports = {
  helpf: '(phrase | times | separator)',
  desc: "Repeats the phrase by the times specified. If the separator is specified, it'll separate each repetition with the separator.",
  func: function (matches, msg) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions
    let tempdata = poopy.tempdata
    let config = poopy.config

    var word = matches[1]
    var split = splitKeyFunc(word)
    var phrase = split[0] ?? ''
    var times = Math.min(Number(split[1] ?? ''), 100)
    var separator = split.slice(2).length ? split.slice(2).join('|') : ''
    var repeat = []
    for (var i = 0; i < times; i++) {
      repeat.push(phrase)
      tempdata[msg.author.id][msg.id]['keyattempts']++
      if (tempdata[msg.author.id][msg.id]['keyattempts'] >= config.keyLimit) break
    }
    return repeat.join(separator)
  },
  limit: 5
}