module.exports = {
  desc: 'shit gif',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    var shitting = arrays.shitting.filter(file => file.match(/\.(gif|apng)/))

    return shitting[Math.floor(Math.random() * shitting.length)]
  },
  array: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.shitting.filter(file => file.match(/\.(gif|apng)/))
  }
}