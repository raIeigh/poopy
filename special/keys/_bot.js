module.exports = {
  desc: 'Returns whether the channel is NSFW or not.',
  func: async function (msg) {
    let poopy = this

    return msg.author.bot || ''
  }
}