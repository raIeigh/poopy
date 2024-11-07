module.exports = {
  helpf: '(id)',
  desc: 'Fetches the global name of the user with the specified ID.',
  func: async function (matches) {
    let poopy = this
    let bot = poopy.bot

    var word = matches[1]

    var user = await bot.users.fetch(word).catch(() => { })

    return user ? user.globalName : ''
  }
}