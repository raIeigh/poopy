module.exports = {
  helpf: '(id)',
  desc: 'Fetches the content of the Pastebin with that ID, useful if your command hits the 2000 character limit.',
  func: async function (matches) {
    let poopy = this
    let modules = poopy.modules

    var word = matches[1]
    var res = await modules.axios.get(`https://pastebin.com/raw/${word}`, { responseType: 'text' }).catch(() => { })

    if (!res) return word

    return res.data
  },
  limit: 1
}