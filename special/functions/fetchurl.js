module.exports = {
  helpf: '(number)',
  desc: "Returns the first URL in the message. If <number> is supplied, it'll return the URL in the message with index <number>.",
  func: async function (matches, msg, _, string) {
    let poopy = this

    var word = matches[1]
    var urls = await poopy.functions.getUrls(msg, { string: string }).catch(() => { }) ?? []
    var number = isNaN(Number(word)) ? 0 : Number(word) <= 0 ? 0 : Number(word) >= urls.length - 1 ? urls.length - 1 : Math.round(Number(word)) || 0
    return urls[number] ?? ''
  }
}