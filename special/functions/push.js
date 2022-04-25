module.exports = {
  helpf: '(arrayName | value)',
  desc: 'Pushes a new value to an array.',
  func: async (matches, msg) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var name = split[0] ?? ''
    var value = split[1] ?? ''

    var array = poopy.tempdata[msg.author.id]['arrays'][name]
    if (!array) return ''

    array.push(value)

    return ''
  }
}