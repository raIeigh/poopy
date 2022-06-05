module.exports = {
  helpf: '(arrayName)',
  desc: 'Reverses the array with that name.',
  func: function (matches, msg) {
    let poopy = this

    var word = matches[1]

    var array = poopy.tempdata[msg.author.id]['arrays'][word]
    if (!array) return ''

    array = array.reverse()

    return ''
  }
}