module.exports = {
  helpf: '(arrayName | value)',
  desc: 'Pushes a new raw value to an array.',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
    var value = split[1] ?? ''

    var array = poopy.tempdata[msg.author.id]['arrays'][name]
    if (!array) return ''

    array.push(value)

    return ''
  },
  raw: true
}