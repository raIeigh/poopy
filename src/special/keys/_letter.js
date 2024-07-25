module.exports = {
  desc: 'Returns a random letter.',
  func: function () {
    let poopy = this

    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  },
  array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
}