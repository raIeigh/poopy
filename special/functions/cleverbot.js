module.exports = {
  helpf: '(phrase)',
  desc: 'Generates a response to the phrase inside the function with Cleverbot AI.',
  func: async (matches, msg) => {
    let poopy = this

    var word = matches[1]

    var resp = await poopy.functions.cleverbot(word, msg.channel.id).catch(() => { })

    if (resp) {
      return resp
    }

    return word
  },
  attemptvalue: 10
}