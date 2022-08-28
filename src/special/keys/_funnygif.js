module.exports = {
  desc: 'Returns a random funny meme GIF like Nostalgia Critic clapping or Walter White falling.',
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.funnygifs[Math.floor(Math.random() * arrays.funnygifs.length)]
  }
}