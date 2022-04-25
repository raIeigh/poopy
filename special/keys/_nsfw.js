module.exports = {
  desc: 'Returns whether the channel is NSFW or not.',
  func: async (msg) => {
    let poopy = this

    return msg.channel.nsfw || ''
  }
}