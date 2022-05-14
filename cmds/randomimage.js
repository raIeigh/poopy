module.exports = {
  name: ['randomimage'],
  execute: async function (msg) {
    let poopy = this

    var imageJSON = poopy.json.imageJSON
    var image = imageJSON.data[Math.floor(Math.random() * imageJSON.data.length)]
    await msg.channel.send({
      content: image.description,
      files: [new poopy.modules.Discord.MessageAttachment('https://randomwordgenerator.com' + image.image_url)],
    }).catch(() => { })
  },
  help: { name: 'randomimage', value: 'Generates a random image.' },
  cooldown: 2500,
  type: 'Random'
}