module.exports = {
  desc: 'Returns a random Phexonia Studios related GIF.',
  func: function () {
    let poopy = this

    var psGifs = []

    for (var i in poopy.arrays.psFiles) {
      var file = poopy.arrays.psFiles[i]
      if (file.match(/\.(gif|apng)/)) psGifs.push(file)
    }

    return psGifs[Math.floor(Math.random() * psGifs.length)]
  }
}