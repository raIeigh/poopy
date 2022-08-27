module.exports = {
  desc: 'Returns a random Phexonia Studios related video.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var psVideos = []

    for (var i in arrays.psFiles) {
      var file = arrays.psFiles[i]
      if (file.match(/\.(mov|mp4)/)) psVideos.push(file)
    }

    return psVideos[Math.floor(Math.random() * psVideos.length)]
  }
}