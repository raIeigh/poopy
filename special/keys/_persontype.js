module.exports = {
  desc: "Returns a random type of person. (i honestly don't know what to call it)",
  func: async () => {
    let poopy = this

    var insults = [
      'gay',
      'lesbian',
      'catboy',
      'catboy maid',
      'maid',
      'trans',
      'bisexual',
      'pedophile',
      'zoophile',
      'degenerate',
      'femboy',
      'furry',
      'tomboy',
      'horny',
      'racist',
      'underaged',
      'gamer',
      'oder',
      'gangster',
      'male',
      'female',
      'homophobic',
      'xenobic',
      'transphobic'
    ]

    return insults[Math.floor(Math.random() * insults.length)]
  }
}