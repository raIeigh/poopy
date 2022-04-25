module.exports = {
  name: ['baldi'],
  execute: async function (msg) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    var attachment = new poopy.modules.Discord.MessageAttachment('templates/baldi.mp4')
    msg.channel.send({
      files: [attachment]
    }).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: { name: 'baldi', value: 'YO MAMA!' },
  cooldown: 2500,
  type: 'OG'
}