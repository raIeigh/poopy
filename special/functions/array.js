module.exports = {
  helpf: '(arrayName)',
  desc: "Creates a new array with the specified name. If it already exists, it'll be cleared.",
  func: async function (matches, msg, _, string) {
    let poopy = this

    var word = matches[1]
    var fullword = `${matches[0]}(${matches[1]})`
    var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
    poopy.tempdata[msg.author.id]['arrays'][word] = []
    return [phrase, true]
  },
  attemptvalue: 5
}