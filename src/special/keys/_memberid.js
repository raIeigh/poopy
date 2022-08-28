module.exports = {
  desc: "Returns a random member's ID from the server.",
  func: function (msg) {
    let poopy = this
    let data = poopy.data

    var datamembers = data['guild-data'][msg.guild.id]['members'];
    var keys = Object.keys(datamembers)
    return keys[Math.floor(Math.random() * keys.length)]
  }
}