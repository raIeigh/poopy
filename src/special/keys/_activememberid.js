module.exports = {
  desc: "Returns a random active member's ID from the server, this is calculated by the number of messages each one has sent.",
  func: function (msg) {
    let poopy = this
    let data = poopy.data

    var datamembers = data.guildData[msg.guild.id]['members']
    var keys = Object.keys(datamembers)

    var sum = 0
    for (var id in datamembers) {
      var value = Math.max(Math.min(datamembers[id].messages || 0, 1000), 0) - Math.floor((Date.now() - datamembers[id].lastmessage || 0) / 604800000) * 100 || 0
      sum += value
    }

    var rnd = Math.random() * sum
    var counter = 0

    for (var id in datamembers) {
      var value = Math.max(Math.min(datamembers[id].messages || 0, 1000), 0) - Math.floor((Date.now() - datamembers[id].lastmessage || 0) / 604800000) * 100 || 0
      counter += value
      if (counter > rnd) {
        return id
      }
    }

    return keys[0]
  },
  array: function (msg) {
    let poopy = this
    let data = poopy.data

    var datamembers = data.guildData[msg.guild.id]['members'];
    return Object.keys(datamembers)
  }
}