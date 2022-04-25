module.exports = {
  desc: 'Returns a random Phexonia Studios related video.',
  func: async function () {
    let poopy = this

    var psVideos = []

    for (var i in poopy.arrays.psFiles) {
      var file = poopy.arrays.psFiles[i]
      if (file.match(/\.(mov|mp4)/)) psVideos.push(file)
    }

    return psVideos[Math.floor(Math.random() * psVideos.length)]
  }
}