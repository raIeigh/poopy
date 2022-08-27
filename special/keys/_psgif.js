module.exports = {
  desc: 'Returns a random Phexonia Studios related GIF.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var psGifs = []

    for (var i in arrays.psFiles) {
      var file = arrays.psFiles[i]
      if (file.match(/\.(gif|apng)/)) psGifs.push(file)
    }

    return psGifs[Math.floor(Math.random() * psGifs.length)]
  }
}