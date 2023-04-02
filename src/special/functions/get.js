module.exports = {
  helpf: '(url | headers)',
  desc: "GETs the content from the URL, but only if it isn't binary. Useful if your command hits the 2000 character limit or wanna use a free API.",
  func: async function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions
    let { axios, itob } = poopy.modules

    var [ url, headers ] = splitKeyFunc(matches[1], { args: 2 })
    headers = headers ?? '{}'

    if (url.includes("ip")) return "no doxxing for you lmao";

    var res = await axios.get(url, { headers: JSON.parse(headers), responseType: 'arraybuffer' }).catch(() => { })

    if (!res || itob.isBinary(null, res.data)) return url

    return res.data.toString()
  },
  limit: 5
}
