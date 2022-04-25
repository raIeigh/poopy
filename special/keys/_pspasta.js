module.exports = {
  desc: 'Returns a random Phexonia Studios related copypasta or phrase.',
  func: async () => {
    let poopy = this

    return poopy.arrays.psPasta[Math.floor(Math.random() * poopy.arrays.psPasta.length)]
  }
}