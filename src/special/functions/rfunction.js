module.exports = {
  helpf: '(phrase)',
  desc: 'chooses A RANDOM fUNCTION to USE With The Text.',
  func: async function (matches, msg, isBot, string, opts) {
    let poopy = this
    let special = poopy.special

    var funcs = []
    for (var ff in special.functions) {
      funcs.push(ff)
    }

    var func = special.functions[funcs[Math.floor(Math.random() * funcs.length)]].func
    if (func.constructor.name == 'AsyncFunction') return await func.call(poopy, matches, msg, isBot, string, opts).catch(() => { }) ?? ''
    else return func.call(poopy, matches, msg, isBot, string, opts)
  },
  attemptvalue: 10,
  limit: 5
}