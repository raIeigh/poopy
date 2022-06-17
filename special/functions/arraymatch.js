module.exports = {
  helpf: '(arrayName | phrase | regexp)',
  desc: `Creates a new array by globally matching everything in the phrase by the RegExp. If it already exists, it'll be replaced.`,
  func: function (matches, msg, _, string) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 3 })
    var name = split[0] ?? ''
    var phr = split[1] ?? ''
    var reg = split[2] ?? ''
    var regexp = new RegExp(reg, 'ig')
    var fullword = `${matches[0]}(${matches[1]})`
    var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
    poopy.tempdata[msg.author.id]['arrays'][name] = phr.match(regexp)
    return [phrase, true]
  },
  attemptvalue: 5
}