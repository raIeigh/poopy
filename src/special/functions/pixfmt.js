module.exports = {
  helpf: '(url)',
  desc: 'Fetches the pixel format of the specified file.',
  func: async function (matches) {
    let poopy = this
    let { validateFile } = poopy.functions

    var word = matches[1]

    var error
    var fileinfo = await validateFile(word, 'very true').catch(err => {
      error = err
    })
    if (error) return error

    return fileinfo.info.pixfmt
  }
}