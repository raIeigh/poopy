module.exports = {
  helpf: '(phrase)',
  desc: 'Generates subsequent text from the phrase inside the function.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]

    var resp = await poopy.modules.deepai.callStandardApi("text-generator", {
      text: word,
    }).catch(() => { })

    if (resp) {
      return resp.output
    }

    return word
  },
  attemptvalue: 10,
  limit: 1
}