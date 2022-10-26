module.exports = {
  desc: 'Returns a random Phexonia Studios related file.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psFiles[Math.floor(Math.random() * arrays.psFiles.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psFiles
  }
}