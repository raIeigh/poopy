module.exports = {
  helpf: '(text)',
  desc: 'Returns the index of the argument in the message that matches the text inside the function.',
  func: async (matches, msg, isBot, string) => {
    let poopy = this

    var f = matches[0]
    var word = matches[1]
    var words = isBot ? msg.content.replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), '').split(' ') : string.replace(new RegExp(`${f}\\(([\\s\\S]*?)\\)`, 'ig'), '').split(' ')
    return words.findIndex(w => w.toLowerCase().includes(word.toLowerCase()))
  }
}