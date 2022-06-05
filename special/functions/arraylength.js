module.exports = {
  helpf: '(arrayName)',
  desc: 'Returns the length of the array.',
  func: function (matches, msg) {
    let poopy = this

    var word = matches[1]
    return (poopy.tempdata[msg.author.id]['arrays'][word] ?? []).length
  }
}