module.exports = {
  desc: 'Returns a random keyword.',
  func: async function (msg) {
    let poopy = this
    let special = poopy.special

    var keys = []
    for (var k in special.keys) {
      keys.push(k)
    }

    var func = special.keys[keys[Math.floor(Math.random() * keys.length)]].func
    if (func.constructor.name == 'AsyncFunction') return await func.call(poopy, msg).catch(() => { }) ?? ''
    else return func.call(poopy, msg)
  },
  attemptvalue: 2,
  limit: 5
}