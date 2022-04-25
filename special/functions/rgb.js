module.exports = {
  helpf: '(hex)',
  desc: 'Converts the supplied hex code to RGB.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(word)
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '0 0 0'
  }
}