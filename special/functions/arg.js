module.exports = {
  helpf: '(number)',
  desc: 'Returns the argument in the message with the index <number>. Putting "+" after the number means all other arguments after it.',
  func: async (matches, msg, isBot, string) => {
    let poopy = this

    var f = matches[0]
    var word = matches[1]
    var index = Number(word.replace(/\+/g, '')) <= 0 ? 0 : Math.round(Number(word.replace(/\+/g, ''))) || 0
    var words = isBot ? msg.content.replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), '').split(' ') : string.replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), '').split(' ')
    if (word.endsWith('+')) return await poopy.functions.getKeywordsFor(words.slice(index).join(' ') || '', msg, isBot).catch(() => { }) || ''
    return await poopy.functions.getKeywordsFor(words[index] || '', msg, isBot).catch(() => { }) || ''
  }
}