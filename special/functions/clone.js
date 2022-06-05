module.exports = {
  helpf: '(arrayName | cloneName)',
  desc: "Clones a new array from an existing one, giving it a new name. If it doesn't exist, it'll just create a new one.",
  func: function (matches, msg, _, string) {
    let poopy = this

    var word = matches[1]
    var fullword = `${matches[0]}(${matches[1]})`
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var name = split[0] ?? ''
    var clone = split[1] ?? '0'
    var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')

    var array = poopy.tempdata[msg.author.id]['arrays'][name]
    if (!array) return ''

    poopy.tempdata[msg.author.id]['arrays'][clone] = array || []

    return [phrase, true]
  },
  attemptvalue: 5
}