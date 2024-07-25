module.exports = {
  name: ['randomimage'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json
    let { Discord } = poopy.modules

    var imageJSON = json.imageJSON
    var image = imageJSON.data[Math.floor(Math.random() * imageJSON.data.length)]
    if (!msg.nosend) await msg.reply({
      content: image.description,
      files: [new Discord.AttachmentBuilder('https://randomwordgenerator.com' + image.image_url)],
    }).catch(() => { })
    return 'https://randomwordgenerator.com' + image.image_url
  },
  help: { name: 'randomimage', value: 'Generates a random image.' },
  cooldown: 2500,
  type: 'Random'
}