module.exports = {
  desc: 'Returns a random letter.',
  func: function () {
    let poopy = this

    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  }
}