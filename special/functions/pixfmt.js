module.exports = {
  helpf: '(url)',
  desc: 'Fetches the pixel format of the specified file.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]

    var error
    var fileinfo = await poopy.functions.validateFile(word, 'very true').catch(err => {
      error = err.stack
    })
    if (error) return error

    return fileinfo.info.pixfmt
  }
}