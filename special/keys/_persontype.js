module.exports = {
  desc: "Returns a random type of person. (i honestly don't know what to call it)",
  func: async function () {
    let poopy = this

    var type = [
      'male',
      'female',
      'homosexual',
      'lesbian',
      'catboy',
      'maid',
      'transexual',
      'bisexual',
      'pedophile',
      'zoophile',
      'degenerate',
      'femboy',
      'furry',
      'tomboy',
      'racist',
      'underaged',
      'gamer',
      'gangsta',
      'r34 artist',
      'discord mod',
      'moderator',
      'reddit mod',
      'twitter user',
      'cryptopunk',
      'r63 artist',
      'twitch streamer',
      'political',
      'toxic',
      'programmer',
      '4chan user',
      'rr34 modeller',
      'game developer',
      'homophobic',
      'transphobic'
    ]

    return type[Math.floor(Math.random() * type.length)]
  }
}