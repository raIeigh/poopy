module.exports = {
  helpf: '(arrayName | index)',
  desc: 'Removes the value in the array with that index.',
  func: async (matches, msg) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var name = split[0] ?? ''
    var index = split[1] ?? '0'

    var array = poopy.tempdata[msg.author.id]['arrays'][name]
    if (!array) return ''

    array.splice(index, 1)

    return ''
  }
}