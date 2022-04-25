module.exports = {
  helpf: '(seconds)',
  desc: 'Waits the specified seconds. Maximum is 60.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    var waitTime = Number(word)
    await poopy.functions.sleep((waitTime * 1000) > 60000 ? 60000 : waitTime * 1000)
    return ''
  },
  attemptvalue: 10
}