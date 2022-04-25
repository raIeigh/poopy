module.exports = {
  desc: 'Returns your current key attempts.',
  func: async (msg) => {
    let poopy = this

    return poopy.tempdata[msg.author.id]['keyattempts']
  }
}