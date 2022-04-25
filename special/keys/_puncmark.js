module.exports = {
  desc: 'Returns a random punctuation mark.',
  func: async function () {
    let poopy = this

    return poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]
  }
}