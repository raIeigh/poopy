module.exports = {
  helpf: '(url | data)',
  desc: "POSTs the data to the URL and returns the response data. Useful if you wanna use an API.",
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
