module.exports = {
  desc: 'outside media',
  func: function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let config = poopy.config
    let globaldata = poopy.globaldata

    var outsideMediaFolder = arrays.outsideMedia
    var array = outsideMediaFolder.reduce((arr, groupInfo) => arr.concat(groupInfo.list), [])

    return array[Math.floor(Math.random() * array.length)]
  },
  array: function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let config = poopy.config
    let globaldata = poopy.globaldata

    var outsideMediaFolder = arrays.outsideMedia
    var array = outsideMediaFolder.reduce((arr, groupInfo) => arr.concat(groupInfo.list), [])

    return array
  },
  cmdconnected: 'oil'
}
