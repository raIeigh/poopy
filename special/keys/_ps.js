module.exports = {
  desc: 'Returns a random Phexonia Studios related file.',
  func: function () {
    let poopy = this

    return poopy.arrays.psFiles[Math.floor(Math.random() * poopy.arrays.psFiles.length)]
  }
}