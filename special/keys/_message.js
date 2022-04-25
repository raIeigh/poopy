module.exports = {
  desc: 'Returns a random message from the server.',
  func: async function (msg) {
    let poopy = this

    var messages = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['messages']
    return messages.length ? messages[Math.floor(Math.random() * messages.length)].replace(/\@/g, '@‌') : ''
  }
}