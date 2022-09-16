module.exports = {
  helpf: '(phrase | start | end)',
  desc: 'Substrings the phrase from the start point to the end point.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word)
    var phrase = split[0] ?? ''
    var start = (!(isNaN(Number(split[1]))) ? Math.round(Number(split[1])) : undefined) ?? 0
    var end = split.slice(2).length ? (!(isNaN(Number(split.slice(2).join('|')))) ? Math.round(Number(split.slice(2).join('|'))) : undefined) : phrase.length
    if (start < 0) start += phrase.length
    if (end < 0) end += phrase.length
    return phrase.substring(start, end)
  }
}