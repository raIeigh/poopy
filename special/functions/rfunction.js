module.exports = {
  helpf: '(phrase)',
  desc: 'chooses A RANDOM fUNCTION to USE With The Text.',
  func: function (matches, msg, isBot, string) {
    let poopy = this

    var funcs = []
    for (var ff in poopy.special.functions) {
      funcs.push(ff)
    }
    var func = funcs[Math.floor(Math.random() * funcs.length)]
    return poopy.special.functions[func].func(matches, msg, isBot, string)
  },
  attemptvalue: 10
}