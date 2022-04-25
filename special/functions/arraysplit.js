module.exports = {
  helpf: '(arrayName | separator | phrase)',
  desc: `Creates a new array by splitting the phrase by the separator (or "|" if blank), knowing it'll be raw. If it already exists, it'll be replaced.`,
  func: async (matches, msg, isBot, string) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 3 })
    var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
    var separator = split[1] ? await poopy.functions.getKeywordsFor(split[1], msg, isBot).catch(() => { }) : '|'
    var phr = split[2] ?? ''
    var fullword = `${matches[0]}(${matches[1]})`
    var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
    poopy.tempdata[msg.author.id]['arrays'][name] = poopy.functions.splitKeyFunc(phr, { separator: separator })
    return [phrase, true]
  },
  attemptvalue: 5,
  raw: true
}