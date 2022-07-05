module.exports = {
  helpf: '(url)',
  desc: 'Fetches the raw content of the Discord attachment, useful if your command hits the 2000 character limit.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]

    if (!word.match(/https?:\/\/(cdn|media).discordapp.(com|net)\/attachments\/\d{10,}\/\d{10,}\/.+/)) return word

    var res = await poopy.modules.axios.get(word, { responseType: 'text' }).catch(() => { })

    if (!res) return word

    return res.data
  },
  limit: 1
}