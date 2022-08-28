module.exports = {
  helpf: '(url | exception)',
  desc: 'Returns true if the specified file is valid for use, else returns why it isn\'t.',
  func: async function (matches) {
    let poopy = this
    let { splitKeyFunc, validateFile } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var url = split[0] ?? ''
    var exception = split[1] ?? false

    var error
    await validateFile(url, exception).catch(err => {
      error = err
    })
    if (error) return error

    return true
  }
}