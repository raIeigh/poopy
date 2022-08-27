module.exports = {
  helpf: '(url)',
  desc: "Fetches the raw content of the file URL, but only if it isn't binary, useful if your command hits the 2000 character limit.",
  func: async function (matches) {
    let poopy = this
    let modules = poopy.modules

    var word = matches[1]

    var res = await modules.axios.get(word, { responseType: 'arraybuffer' }).catch(() => { })

    if (!res || modules.itob.isBinary(null, res.data)) return word

    return res.data.toString()
  },
  limit: 1
}
