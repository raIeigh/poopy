module.exports = {
  desc: 'Returns a random Phexonia Studios related image.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var psImages = arrays.psFiles.filter(file => file.match(/\.(png|jpe?g|bmp|tiff|webp)/))

    return psImages[Math.floor(Math.random() * psImages.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psFiles.filter(file => file.match(/\.(png|jpe?g|bmp|tiff|webp)/))
  }
}