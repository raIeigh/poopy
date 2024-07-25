module.exports = {
  desc: 'Returns a random Phexonia Studios related video.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var psVideos = arrays.psFiles.filter(file => file.match(/\.(mov|mp4|wmv|avi|webm)/))

    return psVideos[Math.floor(Math.random() * psVideos.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.psFiles.filter(file => file.match(/\.(mov|mp4|wmv|avi|webm)/))
  }
}