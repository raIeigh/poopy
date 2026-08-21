module.exports = {
  desc: 'oil',
  func: function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let config = poopy.config
    let globaldata = poopy.globaldata

    var oilFolder = arrays.shitting
    if (process.env.SECRET_TRIGGER && config.tumoreTesters.includes(msg.author.id) && msg.guildId == process.env.SECRET_TRIGGER) {
      oilFolder = oilFolder.concat(globaldata.secretShit ?? [])
    }

    return oilFolder[Math.floor(Math.random() * oilFolder.length)]
  },
  array: function (msg) {
    let poopy = this
    let arrays = poopy.arrays
    let config = poopy.config
    let globaldata = poopy.globaldata

    var oilFolder = arrays.shitting
    if (process.env.SECRET_TRIGGER && config.tumoreTesters.includes(msg.author.id) && msg.guildId == process.env.SECRET_TRIGGER) {
      oilFolder = oilFolder.concat(globaldata.secretShit ?? [])
    }

    return oilFolder
  },
  cmdconnected: 'oil'
}
