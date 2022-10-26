module.exports = {
  desc: 'Returns a random Phexonia Studios related GIF.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var psGifs = arrays.psFiles.filter(file => file.match(/\.(gif|apng)/))

    return psGifs[Math.floor(Math.random() * psImages.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psFiles.filter(file => file.match(/\.(gif|apng)/))
  }
}