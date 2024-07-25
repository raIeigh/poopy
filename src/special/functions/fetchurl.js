module.exports = {
  helpf: '(phrase | number)',
  desc: "Returns the first URL in the phrase. If <number> is supplied, it'll return the URL in the phrase with index <number>.",
  func: async function (matches, msg) {
    let poopy = this
    let { splitKeyFunc, getUrls } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var phrase = split[0] ?? ''
    var number = split[1] ?? '0'
    var urls = await getUrls(msg, { string: phrase, prefix: true }).catch(() => { }) ?? []
    number = isNaN(Number(number)) ? 0 : Number(number) <= 0 ? 0 : Number(number) >= urls.length - 1 ? urls.length - 1 : Math.round(Number(number)) || 0
    return urls[number] ?? ''
  }
}