module.exports = {
  desc: 'Returns a random active member from the server, this is calculated by the number of messages each one has sent.',
  func: function (msg) {
    let poopy = this
    let data = poopy.data

    var datamembers = data['guild-data'][msg.guild.id]['members']
    var usermembers = {}
    for (var id in datamembers) {
      var datamember = datamembers[id]
      if (datamember.username) usermembers[id] = datamember
    }
    var keys = Object.keys(usermembers)

    var sum = 0
    for (var id in usermembers) {
      sum += Math.min(usermembers[id].messages, 1000) || 0
    }

    var rnd = Math.random() * sum
    var counter = 0

    for (var id in usermembers) {
      counter += Math.min(usermembers[id].messages, 1000) || 0
      if (counter > rnd) {
        return usermembers[id].username.replace(/\@/g, '@‌')
      }
    }

    return usermembers[keys[0]].username.replace(/\@/g, '@‌')
  }
}