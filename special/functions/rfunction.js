module.exports = {
  helpf: '(phrase)',
  desc: 'chooses A RANDOM fUNCTION to USE With The Text.',
  func: async function (matches, msg, isBot, string, opts) {
    let poopy = this

    var funcs = []
    for (var ff in poopy.special.functions) {
      funcs.push(ff)
    }

    var func = poopy.special.functions[funcs[Math.floor(Math.random() * funcs.length)]].func
    if (func.constructor.name == 'AsyncFunction') return await func.call(poopy, matches, msg, isBot, string, opts).catch(() => { }) ?? ''
    else return func.call(poopy, matches, msg, isBot, string, opts)
  },
  attemptvalue: 10
}