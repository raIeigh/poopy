module.exports = {
  desc: 'Returns a random Phexonia Studios related image.',
  func: async function () {
    let poopy = this

    var psImages = []

    for (var i in poopy.arrays.psFiles) {
      var file = poopy.arrays.psFiles[i]
      if (!(file.match(/\.(gif|mov|mp4|apng)/))) psImages.push(file)
    }

    return psImages[Math.floor(Math.random() * psImages.length)]
  }
}