module.exports = {
  desc: 'Returns a random Phexonia Studios related image.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var psImages = []

    for (var i in arrays.psFiles) {
      var file = arrays.psFiles[i]
      if (!(file.match(/\.(gif|mov|mp4|apng)/))) psImages.push(file)
    }

    return psImages[Math.floor(Math.random() * psImages.length)]
  }
}