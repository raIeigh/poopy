module.exports = {
  desc: 'Returns a random keyword.',
  func: async (msg) => {
    let poopy = this

    var keys = []
    for (var k in poopy.specialkeys.keys) {
      keys.push(k)
    }
    return poopy.specialkeys.keys[keys[Math.floor(Math.random() * keys.length)]].func(msg)
  },
  attemptvalue: 2
}