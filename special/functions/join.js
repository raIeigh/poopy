module.exports = {
  helpf: '(arrayName | separator)',
  desc: 'Joins all the elements in the array with the separator.',
  func: async function (matches, msg, isBot) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
    var separator = split[1] ?? ''

    var array = poopy.tempdata[msg.author.id]['arrays'][name]
    if (!array) return ''

    var asyncArray = await Promise.all(array.map(async val => {
      return await poopy.functions.getKeywordsFor(val, msg, isBot).catch(() => { }) ?? ''
    })).catch(() => { }) ?? []

    return asyncArray.join(separator)
  }
}