module.exports = {
  desc: 'Returns a random number.',
  func: function () {
    let poopy = this

    return Math.floor(Math.random() * 10)
  }
}