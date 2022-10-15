module.exports = {
  helpf: '(url)',
  desc: "GETs the content from the URL, but only if it isn't binary. Useful if your command hits the 2000 character limit or wanna use a free API.",
  func: async function (matches) {
    let poopy = this
    let { axios, itob } = poopy.modules

    var word = matches[1]

    var res = await axios.get(word, { responseType: 'arraybuffer' }).catch(() => { })

    if (!res || itob.isBinary(null, res.data)) return word

    return res.data.toString()
  },
  limit: 1
}
