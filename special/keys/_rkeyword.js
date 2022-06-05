module.exports = {
  desc: 'Returns a random keyword.',
  func: function (msg) {
    let poopy = this

    var keys = []
    for (var k in poopy.special.keys) {
      keys.push(k)
    }
    return poopy.special.keys[keys[Math.floor(Math.random() * keys.length)]].func(msg)
  },
  attemptvalue: 2
}