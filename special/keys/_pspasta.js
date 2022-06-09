module.exports = {
  desc: 'Returns a random Phexonia Studios related copypasta or phrase.',
  func: function () {
    let poopy = this

    return poopy.arrays.psPasta[Math.floor(Math.random() * poopy.arrays.psPasta.length)]
  },
  attemptvalue: 5,
  limit: 5
}