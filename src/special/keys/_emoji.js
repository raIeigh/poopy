module.exports = {
  desc: 'Returns a random Unicode emoji.',
  func: function () {
    let poopy = this
    let json = poopy.json

    return json.emojiJSON[Math.floor(Math.random() * json.emojiJSON.length)].emoji
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.emojiJSON.map(e => e.emoji)
  }
}