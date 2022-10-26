module.exports = {
  desc: 'Returns a random number digit.',
  func: function () {
    let poopy = this

    return Math.floor(Math.random() * 10)
  },
  array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}