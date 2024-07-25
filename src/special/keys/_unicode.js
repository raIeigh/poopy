module.exports = {
  desc: 'Returns a completely random unicode character.',
  func: function () {
    let poopy = this

    return String.fromCharCode(Math.floor(Math.random() * 15000))
  }
}