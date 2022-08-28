module.exports = {
  desc: 'Returns a random punctuation mark.',
  func: function () {
    let poopy = this
    let vars = poopy.vars

    return vars.punctuation[Math.floor(Math.random() * vars.punctuation.length)]
  }
}