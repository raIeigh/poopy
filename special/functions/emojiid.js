module.exports = {
  helpf: '(name)',
  desc: 'Fetches the ID of the emoji from name.',
  func: async function (matches, msg) {
    let poopy = this

    var word = matches[1]

    var emoji = msg.guild.emojis.cache.find(emoji => emoji.name == word)

    return emoji ? emoji.id : ''
  }
}