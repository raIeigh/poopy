module.exports = {
  helpf: '(url)',
  desc: 'Fetches and returns the file name of the specified file.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]

    var error
    var fileinfo = await poopy.functions.validateFile(word, 'very true').catch(err => {
      error = err.stack
    })
    if (error) return error

    return fileinfo.name
  }
}