module.exports = {
  helpf: '(url)',
  desc: 'Fetches and returns the size of the specified file in bytes.',
  func: async function (matches) {
    let poopy = this
    let { validateFile } = poopy.functions

    var word = matches[1]

    var error
    var fileinfo = await validateFile(word, 'very true').catch(err => {
      error = err
    })
    if (error) return error

    return fileinfo.info.realsize
  }
}