module.exports = {
  helpf: '(number)',
  desc: "Returns the last URL in the channel. If <number> is supplied, it'll return the last URL with index <number>, knowing the limit is 100.",
  func: function (matches, msg) {
    let poopy = this

    var word = matches[1]
    var lastUrls = poopy.functions.lastUrls(msg.guild.id, msg.channel.id)
    var number = isNaN(Number(word)) ? 0 : Number(word) <= 0 ? 0 : Number(word) >= lastUrls.length - 1 ? lastUrls.length - 1 : Math.round(Number(word)) || 0
    return lastUrls[number] ?? ''
  }
}