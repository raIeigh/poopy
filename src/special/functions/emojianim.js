module.exports = {
  helpf: '(id)',
  desc: 'Fetches whether the emoji is animated or not from its ID.',
  func: function (matches, msg) {
    let poopy = this

    var word = matches[1]

    var emoji = msg.guild.emojis.cache.get(word)

    return emoji ? emoji.animated ? 'true' : '' : ''
  }
}