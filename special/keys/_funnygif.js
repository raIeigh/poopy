module.exports = {
  desc: 'Returns a random funny meme GIF like Nostalgia Critic clapping or Walter White falling.',
  func: async () => {
    let poopy = this

    return poopy.arrays.funnygifs[Math.floor(Math.random() * poopy.arrays.funnygifs.length)]
  }
}