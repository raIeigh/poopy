module.exports = {
  desc: 'Returns a random punctuation mark.',
  func: async () => {
    let poopy = this

    return poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]
  }
}