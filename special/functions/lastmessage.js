module.exports = {
  helpf: '(index)',
  desc: 'Returns the content of the last message in the channel. If index is specified, it returns the content of the message with that index.',
  func: async (matches, msg, isBot) => {
    let poopy = this

    var f = matches[0]
    var word = matches[1]

    var messages = await msg.channel.messages.fetch().catch(() => { })
    if (!messages) return ''

    var index = poopy.functions.parseNumber(word, { dft: 0, min: 0, max: messages.size - 1, round: true })

    return await poopy.functions.getKeywordsFor(([...messages.values()][index].content ?? '').replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), ''), msg, isBot).catch(() => { }) ?? ''
  },
  attemptvalue: 10
}