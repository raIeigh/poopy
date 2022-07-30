module.exports = {
  helpf: '(url | exception)',
  desc: 'Returns true if the specified file is valid for use.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 2 })
    var url = split[0] ?? ''
    var exception = split[1] ?? false

    var fileinfo = await poopy.functions.validateFile(url, exception).catch(() => { })

    return fileinfo ?? ''
  }
}