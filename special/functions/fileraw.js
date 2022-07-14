module.exports = {
  helpf: '(url)',
  desc: "Fetches the raw content of the file URL, but only if it isn't binary, useful if your command hits the 2000 character limit.",
  func: async function (matches) {
    let poopy = this

    var word = matches[1]

    var res = await poopy.modules.axios.get(word, { responseType: 'arraybuffer' }).catch(() => { })

    if (!res || poopy.modules.itob.isBinary(null, res.data)) return word

    return res.data.toString()
  },
  limit: 1
}
