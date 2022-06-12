module.exports = {
  desc: 'Returns your current key attempts.',
  func: function (msg) {
    let poopy = this

    return poopy.tempdata[msg.author.id][msg.id]['keyattempts']
  }
}