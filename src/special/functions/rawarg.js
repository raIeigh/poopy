module.exports = {
  helpf: '(number)',
  desc: 'Returns the argument in the message with the index <number>, except keywords and functions are not executed automatically. Putting "+" after the number means all other arguments after it.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { getKeywordsFor } = poopy.functions

    var f = matches[0]
    var word = matches[1]
    var index = Number(word.replace(/\+/g, '')) <= 0 ? 0 : Math.round(Number(word.replace(/\+/g, ''))) || 0
    var words = isBot ? msg.oldcontent.replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), '').split(' ') : msg.content.replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), '').split(' ')
    if (word.endsWith('+')) return await getKeywordsFor(words.slice(index).join(' ') || '', msg, isBot, opts).catch(() => { }) || ''
    return await getKeywordsFor(words[index] || '', msg, isBot, opts).catch(() => { }) || ''
  }
}