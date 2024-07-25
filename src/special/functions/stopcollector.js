module.exports = {
  helpf: '(sendFinishPhrase)',
  desc: 'Stops any message collector you created that is still active in the channel.',
  func: function (matches, msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    var word = matches[1]

    if (tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector && tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector.stop) {
      tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector.stop(word ? 'time' : 'user')
      delete tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector
    }
  
    return ''
  }
}