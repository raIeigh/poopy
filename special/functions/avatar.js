module.exports = {
  helpf: '(id)',
  desc: 'Fetches the avatar of the user with the specified ID.',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]

    var user = await poopy.bot.users.fetch(word).catch(() => { })

    return user ? user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }) : ''
  }
}