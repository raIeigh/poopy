module.exports = {
  desc: "Returns a random member's id from the server.",
  func: async function (msg) {
    let poopy = this

    var datamembers = poopy.data['guild-data'][msg.guild.id]['members'];
    var keys = Object.keys(datamembers)
    return keys[Math.floor(Math.random() * keys.length)]
  }
}