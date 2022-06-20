module.exports = {
  helpf: '(arrayName)',
  desc: 'Sorts the array alphabetically.',
  func: function (matches, msg) {
    let poopy = this

    var word = matches[1]

    var array = poopy.tempdata[msg.author.id]['arrays'][word]
    if (!array) return ''

    array.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1
        if (a.toLowerCase() > b.toLowerCase()) return 1
        return 0
    })

    return ''
  }
}