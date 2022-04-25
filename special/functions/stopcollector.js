module.exports = {
  helpf: '(sendFinishPhrase)',
  desc: 'Stops any message collector you created that is still active in the channel.',
  func: async function (matches, msg) {
    let poopy = this

    var word = matches[1]
    if (poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector) {
      poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector.stop(word ? 'time' : 'user')
      delete poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector
    }
  }
}