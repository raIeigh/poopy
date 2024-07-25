module.exports = {
  desc: 'shit video',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var shitting = arrays.shitting.filter(file => file.match(/\.(mov|mp4|wmv|avi|webm)/))

    return shitting[Math.floor(Math.random() * shitting.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.shitting.filter(file => file.match(/\.(mov|mp4|wmv|avi|webm)/))
  }
}