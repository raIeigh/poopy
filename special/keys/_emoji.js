module.exports = {
  desc: 'Returns a random Unicode emoji.',
  func: function () {
    let poopy = this

    return poopy.json.emojiJSON[Math.floor(Math.random() * poopy.json.emojiJSON.length)].emoji
  }
}