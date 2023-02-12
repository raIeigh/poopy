module.exports = {
  helpf: '(url | data | headers)',
  desc: "POSTs the data to the URL and returns the response data, if it isn't binary. Useful if you wanna use an API.",
  func: async function (matches) {
    let poopy = this
    let { splitKeyFunc, tryJSONparse } = poopy.functions
    let { axios, itob } = poopy.modules

    var [ url, data, headers ] = splitKeyFunc(matches[1], { args: 3 })

    var res = await axios.post(url, tryJSONparse(data) ?? data, { headers: JSON.parse(headers), responseType: 'arraybuffer' }).catch(() => { })
    
    if (!res || itob.isBinary(null, res.data)) return matches[1]

    return res.data.toString()
  },
  limit: 5,
  attemptvalue: 3
}
