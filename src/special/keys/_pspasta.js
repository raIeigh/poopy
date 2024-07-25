module.exports = {
  desc: 'Returns a random Phexonia Studios related copypasta or phrase.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psPasta[Math.floor(Math.random() * arrays.psPasta.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psPasta
  },
  attemptvalue: 5,
  limit: 5
}