module.exports = {
  desc: 'Returns a random member from the server.',
  func: async (msg) => {
    let poopy = this

    var datamembers = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'];
    var members = []
    for (var id in datamembers) {
      var datamember = datamembers[id]
      if (datamember.username) members.push(datamember.username)
    }
    return members[Math.floor(Math.random() * members.length)].replace(/\@/g, '@‌')
  }
}