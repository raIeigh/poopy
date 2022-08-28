module.exports = {
  helpf: '()',
  desc: 'Sends a typing signal to the channel, stops after 10 seconds or when a message (by Poopy) is sent.',
  func: async function (_, msg) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    return ''
  },
  attemptvalue: 2
}