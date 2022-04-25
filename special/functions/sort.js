module.exports = {
  helpf: '(arrayName)',
  desc: 'Sorts the array alphabetically.',
  func: async function (matches, msg) {
    let poopy = this

    var word = matches[1]

    var array = poopy.tempdata[msg.author.id]['arrays'][word]
    if (!array) return ''

    array.sort()

    return ''
  }
}