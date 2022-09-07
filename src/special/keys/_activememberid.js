module.exports = {
  desc: "Returns a random active member's ID from the server, this is calculated by the number of messages each one has sent.",
  func: function (msg) {
    let poopy = this
    let data = poopy.data

    var datamembers = data['guild-data'][msg.guild.id]['members']
    var keys = Object.keys(datamembers)

    var sum = 0
    for (var id in datamembers) {
      sum += Math.min(datamembers[id].messages, 100) || 0
    }

    var rnd = Math.random() * sum
    var counter = 0

    for (var id in datamembers) {
      counter += Math.min(datamembers[id].messages, 100) || 0
      if (counter > rnd) {
        return id
      }
    }

    return keys[0]
  }
}