module.exports = {
  helpf: '(arrayName)',
  desc: 'Sorts the array numerically.',
  func: async (matches, msg) => {
    let poopy = this

    var word = matches[1]

    var array = poopy.tempdata[msg.author.id]['arrays'][word]
    if (!array) return ''

    array.sort((a, b) => {
      return Number(a) - Number(b)
    })

    return ''
  }
}