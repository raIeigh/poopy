module.exports = {
  helpf: '(phrase)',
  desc: 'chooses A RANDOM fUNCTION to USE With The Text.',
  func: async function (matches, msg, isBot, string) {
    let poopy = this

    var funcs = []
    for (var ff in poopy.specialkeys.functions) {
      funcs.push(ff)
    }
    var func = funcs[Math.floor(Math.random() * funcs.length)]
    return poopy.specialkeys.functions[func].func(matches, msg, isBot, string)
  },
  attemptvalue: 10
}