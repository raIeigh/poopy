module.exports = {
  name: ['randomimage'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json
    let modules = poopy.modules

    var imageJSON = json.imageJSON
    var image = imageJSON.data[Math.floor(Math.random() * imageJSON.data.length)]
    await msg.reply({
      content: image.description,
      files: [new modules.Discord.MessageAttachment('https://randomwordgenerator.com' + image.image_url)],
    }).catch(() => { })
  },
  help: { name: 'randomimage', value: 'Generates a random image.' },
  cooldown: 2500,
  type: 'Random'
}